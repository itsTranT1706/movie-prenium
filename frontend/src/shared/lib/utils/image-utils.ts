
/**
 * Get a random image from an array of images, or return the default image.
 * @param images Array of image URLs
 * @param defaultImage Default image URL to return if array is empty or undefined
 * @returns Random image URL or default image
 */
export function getRandomImage(images?: string[], defaultImage?: string): string {
    if (!images || images.length === 0) {
        return defaultImage || '';
    }

    // Safety check: filter out empty strings if any
    const validImages = images.filter(img => img && img.length > 0);

    if (validImages.length === 0) {
        return defaultImage || '';
    }

    const randomIndex = Math.floor(Math.random() * validImages.length);
    return validImages[randomIndex];
}
