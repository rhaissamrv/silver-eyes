import { useField } from 'formik'

function Checkbox({ children, ...props }) {
    const [field, meta] = useField(props, 'checkbox')

    return (
        <>
            <label classname="checkbox"> </label>
            <input type="checkbox" {...field} {...props} />
            {children}
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    )
}

export default Checkbox
