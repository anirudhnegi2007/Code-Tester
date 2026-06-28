import axiosInstance from "../componets/lib/axios";

/**
 * Executes code using the Judge0 sandbox backend route.
 * @param {string} language The programming language ('cpp', 'java', 'python', 'js' / 'javascript')
 * @param {string} code The source code to run
 * @param {string} stdin Standard input for the program
 * @returns {Promise<object>} The execution result containing output, error logs, and execution stats
 */
export async function executeCode(language, code, stdin = "") {
  try {
    // Map standard language names to Judge0 accepted formats
    const lang = language === "javascript" ? "js" : language;
    const response = await axiosInstance.post("/api/problems/execute", {
      language: lang,
      code,
      stdin,
    });
    return response.data;
  } catch (error) {
    console.error("Judge0 code execution failed:", error);
    return {
      run: {
        stderr: error.response?.data?.message || error.message || "Execution failed",
        code: -1,
        stdout: "",
        output: error.response?.data?.message || error.message || "Execution failed"
      },
    };
  }
}
