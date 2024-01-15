const supabase = require("./index.js");

async function getHints() {
  const { data: hints, error } = await supabase.from("hints-list").select("*");

  if (error) throw error;

  return {
    hints,
  };
}

module.exports = {
  getHints,
};
