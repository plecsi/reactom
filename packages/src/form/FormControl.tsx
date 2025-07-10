type FormControlProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
};

export const FormControl = ({ label, htmlFor, children }: FormControlProps) => (
  <div className="formControl">
    <label htmlFor={htmlFor}>{label}</label>
    <div className="adormentwrapper">
      <div className="icon"></div>
      {children}
    </div>
  </div>
);