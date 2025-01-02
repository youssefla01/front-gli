import React from "react";
import { FileText, Image as ImageIcon, Download, Eye } from "lucide-react";
import { Button, Tooltip } from "antd";

interface DocumentPreviewProps {
  document: any;
  temporaryUrl?: string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  temporaryUrl,
}) => {
  const fileExtension = document.name.split(".").pop()?.toLowerCase();
  const isPDF = fileExtension === "pdf";
  const isImage = ["jpg", "jpeg", "png"].includes(fileExtension || "");
  const isWord = ["doc", "docx"].includes(fileExtension || "");

  const documentUrl = temporaryUrl
    ? temporaryUrl
    : `http://localhost:3000/files/${document.url.replace("uploads/", "")}`;

  return (
    <div className="border rounded-lg p-4 mb-4 bg-gray-50">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-white rounded-lg border">
          {isPDF ? (
            <FileText className="w-8 h-8 text-red-500" />
          ) : isImage ? (
            <ImageIcon className="w-8 h-8 text-blue-500" />
          ) : (
            <FileText className="w-8 h-8 text-gray-500" />
          )}
        </div>

        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">{document.name}</h4>
          <p className="text-sm text-gray-500 mb-3">
            {isPDF
              ? "Document PDF"
              : isImage
              ? "Image"
              : isWord
              ? "Document Word"
              : "Document"}
          </p>

          {isImage && documentUrl && (
            <div className="mb-3">
              <img
                src={documentUrl}
                alt="Aperçu"
                className="max-w-[200px] rounded-lg border shadow-sm"
              />
            </div>
          )}

          <div className="flex gap-2">
            {documentUrl && (
              <>
                <Tooltip title="Voir">
                  <Button
                    icon={<Eye className="w-4 h-4" />}
                    onClick={() => window.open(documentUrl, "_blank")}
                  >
                    Voir
                  </Button>
                </Tooltip>

                <Tooltip title="Télécharger">
                  <Button
                    icon={<Download className="w-4 h-4" />}
                    onClick={() => window.open(documentUrl, "_blank")}
                  >
                    Télécharger
                  </Button>
                </Tooltip>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
