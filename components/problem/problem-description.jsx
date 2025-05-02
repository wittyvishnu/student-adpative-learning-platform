"use client"
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function ProblemDescription({ question }) {
  const [openHints, setOpenHints] = useState({});

  const toggleHint = (index) => {
    setOpenHints((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <p>{question.description}</p>
      </div>

      {/* Constraints */}
      {question.constraints?.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Constraints</h3>
          {question.constraints.map((constraint, index) => (
            <p key={index}>{constraint}</p>
          ))}
        </div>
      )}

      {/* Sample Inputs */}
      {question.sampleOutputs?.length > 0 &&
        question.sampleOutputs.map((sample, index) => (
          <div key={index} className="space-y-2">
            <h3 className="font-medium">Sample Input {index + 1}</h3>
            <div className="bg-gray-100 p-4 rounded">
              <pre>{sample.input}</pre>
            </div>

            <h3 className="font-medium">Sample Output {index + 1}</h3>
            <div className="bg-gray-100 p-4 rounded">
              <pre>{sample.output}</pre>
            </div>
          </div>
        ))}

      {/* Explanation */}
      {question.explanation && (
        <div className="space-y-2">
          <h3 className="font-medium">Explanation</h3>
          <p>{question.explanation}</p>
        </div>
      )}

      {/* Hints */}
      {question.hints?.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Hints</h3>
          <ul className="space-y-2">
            {question.hints.map((hint, index) => (
              <li
                key={index}
                className="border rounded-md p-3 bg-white shadow-sm"
              >
                <button
                  onClick={() => toggleHint(index)}
                  className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <span>Hint {index + 1}</span>
                  {openHints[index] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {openHints[index] && (
                  <div className="mt-2 text-gray-600 text-sm bg-gray-50 p-3 rounded">
                    {hint}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
