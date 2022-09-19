export function copyToClipboard(text: string | undefined) {
  if (!text) return alert("no url to copy try again later");
  // Copy the text inside the text field
  navigator.clipboard.writeText(text);

  // Alert the copied text
  alert("Copied url: " + text);
}
