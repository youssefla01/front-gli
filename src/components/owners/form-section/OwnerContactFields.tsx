import React from "react";
import { Form, Input } from "antd";
import MaskedInput from "../../common/MaskedInput";

const OwnerContactFields: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="telephone"
          label="Téléphone"
          rules={[
            { required: true, message: "Le téléphone est requis" },
            {
              pattern: /^\d{2} \d{2} \d{2} \d{2} \d{2}$/,
              message: "Format invalide (XX XX XX XX XX)",
            },
          ]}
        >
          <MaskedInput mask="phone" placeholder="01 23 45 67 89" />
        </Form.Item>

        <Form.Item
          name="numero_urgence"
          label="Numéro d'urgence"
          rules={[
            { message: "Le téléphone est requis" },
            {
              pattern: /^\d{2} \d{2} \d{2} \d{2} \d{2}$/,
              message: "Format invalide (XX XX XX XX XX)",
            },
          ]}
        >
          <MaskedInput mask="phone" placeholder="01 23 45 67 89" />
        </Form.Item>
      </div>

      <Form.Item
        name="adresse"
        label="Adresse"
        rules={[{ required: true, message: "L'adresse est requise" }]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item name="identifiant_fiscal" label="Identifiant fiscal">
          <Input placeholder="Entrez votre identifiant fiscal" />
        </Form.Item>

        <Form.Item
          name="rib"
          label="RIB"
          rules={[
            { message: "Le RIB est requis" },
            { pattern: /^(\d{4} ){6}\d{3}$/, message: "Format invalide" },
          ]}
        >
          <MaskedInput
            mask="rib"
            placeholder="XXXX XXXX XXXX XXXX XXXX XXXX XXX"
          />
        </Form.Item>
      </div>
    </>
  );
};

export default OwnerContactFields;
