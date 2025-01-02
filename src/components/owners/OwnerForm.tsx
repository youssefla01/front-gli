import React, { useEffect, useState } from "react";
import { Form, Button } from "antd";
import { OwnerFormData } from "../../types/owner";
import OwnerInfoFields from "./form-section/OwnerInfoFields";
import OwnerContactFields from "./form-section/OwnerContactFields";
import OwnerDocuments from "./form-section/OwnerDocuments";
import DocumentPreview from "../documents/DocumentPreview";

interface OwnerFormProps {
  initialValues?: OwnerFormData;
  onSubmit: (values: OwnerFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const OwnerForm: React.FC<OwnerFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [form] = Form.useForm();
  const [documents, setDocuments] = useState<any[]>(
    form.getFieldValue("piece_jointe") || []
  );

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setDocuments(form.getFieldValue("piece_jointe") || []);
    } else {
      form.resetFields();
      setDocuments([]);
    }
  }, [initialValues, form]);
  console.log(documents);
  const handleSubmit = (values: any) => {
    const documents =
      values.piece_jointe?.map((file: any) => file.originFileObj) || [];
    onSubmit({
      ...values,
      piece_jointe: documents,
    });
  };

  // Préparer les valeurs initiales avec piece_jointe comme tableau
  const formInitialValues = {
    ...initialValues,
    piece_jointe: initialValues?.piece_jointe || [],
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={formInitialValues}
    >
      <OwnerInfoFields />
      <OwnerContactFields />
      <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>

      <div className="space-y-4 mb-4">
        {documents.map((doc: any) => (
          <DocumentPreview
            key={doc.uid}
            document={{
              uid: doc.uid,
              name: doc.name,
              url: doc.url,
              type: doc.type,
            }}
          />
        ))}
      </div>
      <OwnerDocuments form={form} />

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel}>Annuler</Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? "Modifier" : "Créer"}
        </Button>
      </div>
    </Form>
  );
};

export default OwnerForm;
