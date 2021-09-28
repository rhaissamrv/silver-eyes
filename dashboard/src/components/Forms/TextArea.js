import { useField } from 'formik'

function TextArea({ label, ...props }) {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input> and alse replace ErrorMessage entirely.
    const [field, meta] = useField(props)

    return (
        <>
            <label htmlFor={props.id || props.name}>
                {label}
                <textarea
                    className="text-area text-area-wide"
                    {...field}
                    {...props}
                />
            </label>{' '}
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    )
}

export default TextArea
