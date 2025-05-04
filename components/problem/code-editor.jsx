"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { Submissions } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useAnswerStore } from "@/store/useAnswerStore";
import { useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Loader2,
  Clock,
  Upload,
  Play,
  Send,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// Language templates
const languageTemplates = {
  c: `#include <stdio.h>

int main() {
    // Your code here
    printf("Hello, World!\\n");
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    cout << "Hello, World!" << endl;
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        // Your code here
        System.out.println("Hello, World!");
    }
}`,
  python: `# Your code here
print("Hello, World!")`,
  javascript: `// Your code here
console.log("Hello, World!");`,
};

// Language configurations
const languageConfigs = {
  c: { id: "c", version: "10.2.0", extension: ".c" },
  cpp: { id: "cpp", version: "10.2.0", extension: ".cpp" },
  java: { id: "java", version: "15.0.2", extension: ".java" },
  python: { id: "python", version: "3.10.0", extension: ".py" },
  javascript: { id: "javascript", version: "16.13.2", extension: ".js" },
};

export default function CodeEditor({ solveQuestion }) {
  // State declarations
 
  const [theme, setTheme] = useState("light");
 
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const { language, setLanguage, code, setCode } = useAnswerStore();

useEffect(() => {
  if (!code) {
    setCode(languageTemplates[language]);
  }
}, [language, code, setCode]);

  
  const timerRef = useRef(null);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);


  const { user ,isLoaded} = useUser();
  const { attempts, type, questionid, setAttempts, userid,fullName } = useAnswerStore();

  
  useEffect(() => {
    console.log("Current attempts:", attempts);
    console.log("Question type:", type);
    console.log("Question ID:", questionid);
    console.log("User ID from store:", userid);
    console.log("Clerk User ID:", user?.emailAddresses?.primaryEmailAddress);
    console.log("full name in store",fullName)
  }, [attempts, type, questionid, userid, user]);

  // Auto-resize textarea
  useEffect(() => {
    const resizeTextarea = () => {
      if (textareaRef.current && lineNumbersRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        lineNumbersRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };
    resizeTextarea();
  }, [code]);

  // Timer setup
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Helper functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
    setCode(languageTemplates[value]);
  };

  const handleThemeChange = (value) => {
    setTheme(value);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    if (!isTimerRunning) setIsTimerRunning(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = textareaRef.current?.selectionStart || 0;
      const end = textareaRef.current?.selectionEnd || 0;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 4;
          textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setCode(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  // Code execution functions
  const runCustomInput = async () => {
    setIsRunning(true);
    setStatus("running");
    setOutput("");

    try {
      const langConfig = languageConfigs[language];
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: langConfig.id,
          version: langConfig.version,
          files: [{ name: `main${langConfig.extension}`, content: code }],
          stdin: customInput,
          args: [],
          compile_timeout: 10000,
          run_timeout: 5000,
        }),
      });

      const result = await response.json();
      const output = result.run?.output || "";
      const error = result.run?.stderr || result.compile?.stderr || "";

      setOutput(`=== Custom Input Execution ===\n\nInput:\n${customInput}\n\nOutput:\n${output}${error ? `\nError:\n${error}` : ""}`);
      setStatus("success");
      setStatusMessage("Custom input executed successfully!");
    } catch (error) {
      setOutput("Failed to connect to the execution service.");
      setStatus("error");
      setStatusMessage("Connection error!");
    } finally {
      setIsRunning(false);
    }
  };
  const runCode = async (isSubmission = false) => {
    const testCases = isSubmission 
      ? solveQuestion.question.testcasesForSubmit 
      : solveQuestion.question.testcasesForRun;
  
    console.log(`[DEBUG] Starting ${isSubmission ? 'submission' : 'test run'} with ${testCases.length} test cases`);
  
    if (isSubmission) setIsSubmitting(true);
    else setIsRunning(true);
  
    setStatus("running");
    setOutput("");
    let passedCount = 0;
    let results = [];
  
    try {
      const langConfig = languageConfigs[language];
      console.log(`[DEBUG] Language config:`, langConfig);
  
      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`[DEBUG] Running test case ${i + 1}:`, testCase);
        setStatusMessage(`Running test case ${i + 1}/${testCases.length}...`);
  
        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: langConfig.id,
            version: langConfig.version,
            files: [{ name: `main${langConfig.extension}`, content: code }],
            stdin: testCase.input,
            args: [],
            compile_timeout: 10000,
            run_timeout: 5000,
          }),
        });
  
        const result = await response.json();
        console.log(`[DEBUG] Test case ${i + 1} result:`, result);
  
        const output = result.run?.output?.trim() || "";
        const expectedOutput = testCase.expectedOutput?.trim() || "";
        const isPassed = output === expectedOutput;
  
        if (isPassed) passedCount++;
        results.push({
          input: testCase.input,
          output,
          expectedOutput,
          isPassed,
          error: result.run?.stderr || result.compile?.stderr || null,
        });
      }
  
      console.log(`[DEBUG] Test results: Passed ${passedCount}/${testCases.length}`);
  
      // Handle submission
      if (isSubmission) {
        const allPassed = passedCount === testCases.length;
        const newAttempts = attempts + 1;
        
        // Prepare submission data with better user ID handling
        const userIdToStore = userid || user?.primaryEmailAddress?.emailAddress;
        const Name = fullName||user?.fullName;
        console.log(`[DEBUG] Preparing submission data with userId:`, userIdToStore);
        
        const submissionData = {
          questionId: questionid,
          questionType: type,
          submittedcode: code,
          userId: userIdToStore,
          language,
          totalTestCases: testCases.length,
          totalTestCasesPassed: passedCount,
          passed: allPassed,
          timeTaken: `${elapsedTime}s`,
          createdBy:Name,
        };
  
        console.log("[DEBUG] Full submission data:", submissionData);
  
        try {
          console.log("[DEBUG] Attempting to insert into database...");
          const dbResult = await db.insert(Submissions).values(submissionData);
          console.log("✅ Database insertion successful:", dbResult);
          
          setAttempts(newAttempts);
          console.log(`[DEBUG] Updated attempts in store to ${newAttempts}`);
        } catch (dbError) {
          console.error("❌ Database insertion failed:", dbError);
          throw dbError;
        }
      }
  
      // Format output
      let outputText = `=== ${isSubmission ? "Submission" : "Test Case"} Results ===\n`;
      outputText += `Passed ${passedCount} out of ${testCases.length} test cases\n`;
      if (isSubmission) outputText += `Attempts: ${attempts + 1}\nTime: ${formatTime(elapsedTime)}\n\n`;
  
      results.forEach((result, index) => {
        outputText += `Test Case #${index + 1}: ${result.isPassed ? "✓ PASSED" : "✗ FAILED"}\n`;
        outputText += `Input: ${result.input}\nExpected Output: ${result.expectedOutput}\nYour Output: ${result.output}\n`;
        if (result.error) outputText += `Error: ${result.error}\n`;
        outputText += `\n`;
      });
  
      setOutput(outputText);
      setStatus(passedCount === testCases.length ? "success" : "error");
      setStatusMessage(
        passedCount === testCases.length
          ? "All test cases passed!"
          : `${testCases.length - passedCount} test case(s) failed`
      );
    } catch (error) {
      console.error("❌ Execution error:", error);
      setOutput("Failed to connect to the execution service.");
      setStatus("error");
      setStatusMessage("Connection error!");
    } finally {
      if (isSubmission) {
        setIsSubmitting(false);
        setIsTimerRunning(false);
        console.log("[DEBUG] Submission process completed");
      } else {
        setIsRunning(false);
        console.log("[DEBUG] Test run completed");
      }
    }
  };

  // Line numbers for the code editor
  const lineNumbers = code.split("\n").map((_, i) => i + 1);

  return (
    <div className="space-y-4 max-w-4xl mx-auto p-4">
      {/* Header with timer and controls */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md">
            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="font-mono text-sm">{formatTime(elapsedTime)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Theme</span>
            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="github">GitHub</SelectItem>
                <SelectItem value="monokai">Monokai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Language</span>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="c">C</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Code Editor */}
      <div className={`border rounded-lg overflow-hidden shadow-lg ${
        theme === "dark" ? "bg-gray-900 text-white" :
        theme === "monokai" ? "bg-[#272822] text-white" :
        theme === "github" ? "bg-[#f6f8fa] text-black" :
        "bg-white text-black"
      }`}>
        <div className={`p-2 text-sm border-b flex items-center justify-between ${
          theme === "dark" ? "bg-gray-800 border-gray-700" :
          theme === "monokai" ? "bg-[#3e3d32] border-[#3e3d32]" :
          theme === "github" ? "bg-[#e1e4e8] border-[#e1e4e8]" :
          "bg-gray-100 border-gray-200"
        }`}>
          <div className="flex gap-2">
            <div className={`w-3 h-3 rounded-full ${
              theme === "monokai" ? "bg-red-500" : "bg-red-400"
            }`}></div>
            <div className={`w-3 h-3 rounded-full ${
              theme === "monokai" ? "bg-yellow-500" : "bg-yellow-400"
            }`}></div>
            <div className={`w-3 h-3 rounded-full ${
              theme === "monokai" ? "bg-green-500" : "bg-green-400"
            }`}></div>
          </div>
          <div className={`text-xs ${
            theme === "dark" || theme === "monokai" ? "text-gray-400" : "text-gray-600"
          }`}>
            main{languageConfigs[language].extension}
          </div>
        </div>

        <div className="relative">
          <div className="flex">
            <div
              ref={lineNumbersRef}
              className={`text-right p-4 select-none overflow-hidden ${
                theme === "dark" ? "bg-gray-800 text-gray-500" :
                theme === "monokai" ? "bg-[#2d2d2d] text-gray-500" :
                theme === "github" ? "bg-[#f0f0f0] text-gray-500" :
                "bg-gray-50 text-gray-400"
              }`}
              style={{ width: "50px", minHeight: "200px" }}
            >
              {lineNumbers.map((num) => (
                <div key={num} className="leading-6">{num}</div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              className={`flex-1 p-4 resize-none outline-none font-mono leading-6 ${
                theme === "dark" ? "bg-gray-900 text-gray-100" :
                theme === "monokai" ? "bg-[#272822] text-[#f8f8f2]" :
                theme === "github" ? "bg-[#f6f8fa] text-[#24292e]" :
                "bg-white text-gray-800"
              }`}
              style={{ minHeight: "200px" }}
              spellCheck="false"
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between">
        <div>
          <Button
            variant="outline"
            className="text-sm flex items-center gap-2"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Upload className="h-4 w-4" />
            Upload Code File
          </Button>
          <input
            id="file-upload"
            type="file"
            accept=".c,.cpp,.java,.py,.js,.txt"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-sm"
            onClick={() => {
              const tabsElement = document.getElementById("output-tabs");
              if (tabsElement) {
                const customInputTab = tabsElement.querySelector(
                  '[data-state="inactive"][value="custom-input"]'
                );
                if (customInputTab) customInputTab.click();
              }
            }}
          >
            Test with custom input
          </Button>
          <Button
            className="text-sm bg-black text-white hover:bg-gray-800 flex items-center gap-2"
            onClick={() => runCode(false)}
            disabled={isRunning}
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Run Code
          </Button>
          <Button
            className="text-sm bg-[#9efa35] text-black hover:bg-[#8de42d] flex items-center gap-2"
            onClick={() => runCode(true)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Submit Code
          </Button>
        </div>
      </div>

      {/* Output and Custom Input Tabs */}
      <Tabs defaultValue="output" className="border rounded-lg shadow-sm" id="output-tabs">
        <TabsList className="w-full border-b rounded-none bg-gray-50">
          <TabsTrigger value="output" className="flex-1">Output</TabsTrigger>
          <TabsTrigger value="custom-input" className="flex-1">Custom Input</TabsTrigger>
        </TabsList>

        <TabsContent value="output" className="p-4 min-h-[200px]">
          {status !== "idle" && (
            <div className={`mb-4 p-2 rounded-md flex items-center gap-2 ${
              status === "success" ? "bg-green-50 text-green-700" :
              status === "error" ? "bg-red-50 text-red-700" :
              "bg-blue-50 text-blue-700"
            }`}>
              {status === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : status === "error" ? (
                <AlertCircle className="h-5 w-5" />
              ) : (
                <Loader2 className="h-5 w-5 animate-spin" />
              )}
              <span>{statusMessage}</span>
            </div>
          )}

          {output ? (
            <div className="bg-gray-100 p-4 rounded text-sm font-mono whitespace-pre-wrap overflow-auto max-h-[300px]">
              {output}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              {status === "running" 
                ? "Running test cases..." 
                : "Run your code to see the test results here"}
            </div>
          )}
        </TabsContent>

        <TabsContent value="custom-input" className="p-4 min-h-[200px]">
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Enter your custom input here..."
            className="w-full h-[200px] p-4 border rounded-md font-mono resize-none"
          />
          <div className="mt-2 flex justify-end">
            <Button
              className="text-sm bg-black text-white hover:bg-gray-800 flex items-center gap-2"
              onClick={runCustomInput}
              disabled={isRunning||!isLoaded}
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Run with Custom Input
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}