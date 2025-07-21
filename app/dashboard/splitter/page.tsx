import Card from "@/app/ui/splitter/card";

const items = Array.from({ length: 15 }).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

export default async function Page() {
  return <Card></Card>;
}
