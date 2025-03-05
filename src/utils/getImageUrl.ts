const images: Record<string, { default: ImageMetadata }> = import.meta.glob(
  "/src/images/*.{jpg,jpeg,png}",
  { eager: true },
)

export default function getImageUrl(image: string) {
  const key = Object.keys(images).find((key) => key.includes(image))
  if (!key) return ""
  return images[key]?.default?.src || ""
}
