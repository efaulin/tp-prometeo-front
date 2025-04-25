import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const DatePickerFormik = ({ field, form }) => {
  return (
    <DatePicker
      {...field}
      showIcon
      toggleCalendarOnIconClick
      selected={field.value}
      onChange={(date) => form.setFieldValue(field.name, date)}
      className="form-control btn border"
      dateFormat="dd/MM/yyyy"
    />
  );
};