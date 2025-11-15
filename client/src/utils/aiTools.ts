export const getRecommendSubsectionTool = () => {
  return JSON.stringify({
    type: "function",
    function: {
      name: "recommend_subsection",
      description: "Recommend a subsection for the user to study based on their mastery levels and last studied times. Analyzes all subsections for a given license class and returns the code of the subsection that would benefit the user most.",
      parameters: {
        type: "object",
        properties: {
          licenseClass: {
            type: "string",
            enum: ["T", "G", "E"],
            description: "The license class code: T (Technician), G (General), or E (Extra)"
          }
        },
        required: ["licenseClass"]
      }
    }
  });
};
