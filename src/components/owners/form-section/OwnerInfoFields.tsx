import React from "react";
import { Form, Input } from "antd";

const OwnerInfoFields: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Form.Item
        name="prenom"
        label="Prénom"
        rules={[
          { required: true, message: "Le prénom est requis" },
          {
            pattern: /^[a-zA-Z]+$/,
            message: "Le prénom ne peut contenir que des lettres",
          },
          { min: 2, message: "Le prénom doit avoir au moins 2 caractères" },
        ]}
      >
        <Input placeholder="Entrez votre prénom" />
      </Form.Item>

      <Form.Item
        name="nom"
        label="Nom"
        rules={[
          { required: true, message: "Le nom est requis" },
          {
            pattern: /^[a-zA-Z]+$/,
            message: "Le nom ne peut contenir que des lettres",
          },
          { min: 2, message: "Le nom doit avoir au moins 2 caractères" },
        ]}
      >
        <Input placeholder="Entrez votre nom" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[{ type: "email", message: "L'email est invalide" }]}
      >
        <Input placeholder="exemple@domaine.com" />
      </Form.Item>
    </div>
  );
};

export default OwnerInfoFields;
