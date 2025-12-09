export type FieldType = 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'radio';

export interface Dependency {
  fieldId: string;
  equals: string | number | boolean;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  options?: { label: string; value: string | number }[];
  visibleWhen?: Dependency[];
  validation?: ValidationRule[];
}

export interface FormGroup {
  id: string;
  title: string;
  type: 'group';
  children: (FormField | FormGroup)[];
  visibleWhen?: Dependency[];
}

export interface FormSchema {
  formTitle: string;
  fields: (FormField | FormGroup)[];
}

export interface ValidationRule {
  type: 'required' | 'pattern' | 'minLength' | 'maxLength';
  value?: string | number | boolean;
  message: string;
}