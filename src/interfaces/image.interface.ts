export interface Image {
  imageId: string;
  refId: string;
  imageUrl: string;
  uploadedDate?: Date | null;
  file?: File;
}
