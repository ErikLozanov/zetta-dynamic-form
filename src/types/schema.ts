export type FieldType = 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'radio';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  options?: { label: string; value: string | number }[];
}

export interface FormGroup {
  id: string;
  title: string;
  type: 'group';
  children: (FormField | FormGroup)[];
}

export interface FormSchema {
  formTitle: string;
  fields: (FormField | FormGroup)[];
}