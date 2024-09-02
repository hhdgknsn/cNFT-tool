import React from 'react';

export const TextInput = ({ label, value, onChange, name }) => (
  <div>
    <label>{label}</label>
    <input type="text" name={name} value={value} onChange={onChange} />
  </div>
);

export const TextAreaInput = ({ label, value, onChange, name }) => (
  <div>
    <label>{label}</label>
    <textarea name={name} value={value} onChange={onChange}></textarea>
  </div>
);