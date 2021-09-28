import { useFormik } from 'formik'

function RegistrationForm() {
    // ! REFERENCE : workOrderSchema from Work_Order.js
    // const workOrderSchema = new Schema({
    //         customer: String,
    //         date: String,
    //         time: String,
    //         pilot : String,
    //         flight_plan: Array,
    //         flight_data: Array,
    //         analytics: {
    //             video: String
    //         }

    const validate = (values) => {
        const errors = {}
        if (!values.flightPlan) {
            errors.flightPlan = 'Required'
        } else if (values.flightPlan.length > 15) {
            errors.flightPlan = 'Must be 15 characters or less.'
        }

        if (!values.customer) {
            errors.customer = 'Required'
        } else if (values.customer.length > 20) {
            errors.customer = 'Must be 20 characters or less.'
        }

        if (!values.email) {
            errors.email = 'Required'
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
        ) {
            errors.email = 'Invalid email address.'
        }

        return errors
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            flightPlan: '',
            customer: '',
        },
        validate,
        // handleReset,
        onSubmit: (values) => {
            console.log(JSON.stringify(values, null, 2))
        },
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="customer">Work Order Number</label>
            <input
                id="customer"
                name="customer"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.customer}
            />
            {formik.errors.customer ? (
                <div>{formik.errors.customer}</div>
            ) : null}

            {/* <label htmlFor="date">Flight Date</label>
            <input
                id="date"
                name="date"
                type="date"
                format="MM/dd/yyyy"
                onChange={formik.handleChange}
                value={formik.values.customer}
            />
            {formik.errors.customer ? (
                <div>{formik.errors.customer}</div>
            ) : null} */}

            <label htmlFor="flightPlan">Flight Plan</label>
            <textarea
                id="flightPlan"
                name="flightPlan"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.flightPlan}
            />
            {formik.errors.flightPlan ? (
                <div>{formik.errors.flightPlan}</div>
            ) : null}

            <label htmlFor="email">Email Address</label>
            <input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                value={formik.values.email}
            />

            <button type="cancel"></button>

            <button type="submit">Submit</button>
        </form>
    )
}

export default RegistrationForm
