import { useField } from 'formik'

function Select({ label, ...props }) {
    const [field, meta] = useField(props)

    return (
        <>
            <label htmlFor={props.id || props.name}>
                {label}
                <select {...field} {...props} />
            </label>
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    )
}

export default Select
