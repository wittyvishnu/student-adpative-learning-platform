import React from 'react'
import Header from "@/components/layout/header"; // Component names should start with uppercase
import Footer from "@/components/layout/footer";
import { ThemeProvider } from "@/components/layout/theme-provider";


function Dashbord({children}) {
  return (
    <div>
       <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                
      <Header />
      {children}
      <Footer />
    </ThemeProvider>
    </div>
  )
}

export default Dashbord