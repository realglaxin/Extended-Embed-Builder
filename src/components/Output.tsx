import { useState } from "react";

import type { Embed } from "../lib/interfaces";
import Highlight from "./Highlight";

function s(strings: TemplateStringsArray, ...values: unknown[]) {
  let escaped = "";

  for (let i = 0; i < strings.length; i++) {
    if (i > 0) {
      escaped += JSON.stringify(`${values[i - 1]}`);
    }
    escaped += strings[i];
  }

  return escaped;
}

export default function Output({ embed }: { embed: Embed }) {
  const [language, setLanguage] = useState<"js">("js");

  let output = "";

  if (language === "js") {
    output += `const embed = client.embed()\n`;

    const steps = [""];

    if (embed.author.name || embed.author.url || embed.author.iconUrl) {
      const substeps = [".author({"];

      if (embed.author.name) substeps.push(s`  name: ${embed.author.name},`);
      if (embed.author.url) substeps.push(s`  url: ${embed.author.url},`);
      if (embed.author.iconUrl)
        substeps.push(s`  iconURL: ${embed.author.iconUrl},`);
      substeps.push(`})`);

      steps.push(substeps.join("\n  "));
    }

    if (embed.title) steps.push(s`.title(${embed.title})`);

    // if (embed.url) steps.push(s`.setURL(${embed.url})`);

    if (embed.description) steps.push(s`.desc(${embed.description})`);

    if (embed.fields.length > 0) {
      const substeps = [".fields("];

      for (const field of embed.fields) {
        substeps.push(`  {`);
        substeps.push(s`    name: ${field.name},`);
        substeps.push(s`    value: ${field.value},`);
        if (field.inline) substeps.push(`    inline: true`);
        else substeps.push(`    inline: false`);
        substeps.push(`  },`);
      }
      substeps.push(`)`);

      steps.push(substeps.join("\n  "));
    }

    if (embed.image) steps.push(s`.img(${embed.image})`);

    if (embed.thumbnail) steps.push(s`.thumb(${embed.thumbnail})`);

    if (embed.footer.text || embed.footer.iconUrl) {
      const substeps = [".footer({"];

      if (embed.footer.text) substeps.push(s`  text: ${embed.footer.text},`);
      if (embed.footer.iconUrl)
        substeps.push(s`  iconURL: ${embed.footer.iconUrl},`);
      substeps.push(`})`);

      steps.push(substeps.join("\n  "));
    }

    if (embed.timestamp) steps.push(`.timestamp()`);

    output += steps.join("\n  ");

    output += `;\n\nawait message.reply({ embeds: [embed] });`;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-white">Output</h2>

      <div className="flex my-2 gap-2">
        <select
          name="language"
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value as "js")}
        >
          <option value="js">main</option>
        </select>
      </div>

      <Highlight language={language} className="rounded text-sm">
        {output}
      </Highlight>
    </div>
  );
}
