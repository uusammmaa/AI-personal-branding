import { getPlaiceholder } from "plaiceholder";

export async function blurDataUrlFromRemote(src: string): Promise<string> {
  const res = await fetch(src, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Failed to fetch image for placeholder: ${src}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const { base64 } = await getPlaiceholder(buf, { size: 10 });
  return base64;
}
