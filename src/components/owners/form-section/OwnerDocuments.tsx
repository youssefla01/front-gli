import React, { useState, useEffect } from "react";
import { Form, Upload, message, FormInstance } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import DocumentPreview from "../../documents/DocumentPreview";

const { Dragger } = Upload;

interface OwnerDocumentsProps {
  form: FormInstance;
}

const OwnerDocuments: React.FC<OwnerDocumentsProps> = ({ form }) => {
  const [documents, setDocuments] = useState<any[]>(
    form.getFieldValue("piece_jointe") || []
  );

  const uploadProps = {
    name: "file",
    multiple: true,
    maxCount: 5,
    beforeUpload: (file: File) => {
      const isPDFOrImage =
        file.type === "application/pdf" || file.type.startsWith("image/");
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isPDFOrImage) {
        message.error("Seuls les fichiers PDF et images sont acceptés");
        return Upload.LIST_IGNORE;
      }
      if (!isLt2M) {
        message.error("Le fichier doit faire moins de 2MB");
        return Upload.LIST_IGNORE;
      }

      return true; // Autoriser l'upload
    },
    onChange: (info: any) => {
      const fileList = info.fileList.map((file: any) => ({
        ...file,
        url:
          file.url ||
          (file.originFileObj ? URL.createObjectURL(file.originFileObj) : ""),
      }));

      form.setFieldsValue({ piece_jointe: fileList });
      setDocuments(fileList); // Mettre à jour l'état local
    },
    onRemove: (file: any) => {
      const fileList = documents.filter((item) => item.uid !== file.uid);
      form.setFieldsValue({ piece_jointe: fileList });
      setDocuments(fileList); // Mettre à jour l'état local
    },
    customRequest: ({ file, onSuccess }: any) => {
      setTimeout(() => onSuccess("ok"), 0); // Simuler une requête réussie (à remplacer selon l'API)
    },
  };

  return (
    <div className="mb-6">
      <Form.Item
        name="piece_jointe"
        valuePropName="fileList"
        getValueFromEvent={(e) => {
          if (Array.isArray(e)) {
            return e;
          }
          return e?.fileList;
        }}
      >
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Cliquez ou glissez des fichiers ici</p>
          <p className="ant-upload-hint">
            PDF ou images uniquement. Max 2MB par fichier. 5 fichiers maximum.
          </p>
        </Dragger>
      </Form.Item>
    </div>
  );
};

export default OwnerDocuments;
