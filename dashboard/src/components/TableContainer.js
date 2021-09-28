import './Defaults.css'
import './TableContainer.css'
import {
    useFilters,
    usePagination,
    useResizeColumns,
    useSortBy,
    useTable,
    useFlexLayout
} from 'react-table'
import {
    faSearch,
    faAngleRight,
    faAngleDoubleRight,
    faAngleLeft,
    faAngleDoubleLeft
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import React from 'react'

/* Code is based on react-table library requirements as per website: https://react-table.tanstack.com/ */

const TableContainer = ({ columns, data, selectedJob }) => {
    const defaultColumn = React.useMemo(
        () => ({
            // if desired to override the default width for a column, this should be done in the parent component
            minWidth: 20, // minWidth is only used as a limit for resizing
            width: 50, // width is used for both the flex-basis and flex-grow
            maxWidth: 200, // maxWidth is only used as a limit for resizing

            Filter: DefaultColumnFilter
        }),
        []
    )

    const {
        getTableProps, // getProps is used to resolve any props that are required for the table wrapper
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize }
    } = useTable(
        {
            // useTable is the root hook
            columns,
            data,
            defaultColumn,
            initialState: { pageIndex: 0 },
            autoResetPage: false,
            autoResetFilters: false
        },
        // additional hooks to use the table features
        useResizeColumns,
        useFlexLayout,
        //useBlockLayout,
        useFilters,
        useSortBy,
        usePagination
    )

    /* displays sorting indicator icon on table header if table header is clicked on */
    const generateSortingIndicator = (column) => {
        return column.isSorted ? (column.isSortedDesc ? ' ⬇' : ' ⬆') : ''
    }

    // forget this
    // const placeholderSearch = '\uf002'

    // 08-23:  Removed ascending/descending sort for demo day

    return (
        <div className="table-container">
            {/* table body */}
            <table className="full-width-table" {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>
                                    <div className="header-container">
                                        <div className="table-header-row-one">
                                            <div /*...column.getSortByToggleProps()*/
                                            >
                                                {column.render('Header')}
                                                {/*generateSortingIndicator(column)*/}
                                            </div>
                                            <div className="table-header-row-two">
                                                <Filter column={column} />
                                            </div>
                                        </div>
                                        <div
                                            {...column.getResizerProps()}
                                            className={`resizer ${
                                                column.isResizing
                                                    ? 'isResizing'
                                                    : ''
                                            }`}
                                        />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row)
                        return (
                            <tr
                                {...row.getRowProps()}
                                //onClick={() => {
                                //    selectedJob(row.original)
                                //}}
                            >
                                {row.cells.map((cell) => {
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            {/* buttons for pagination */}
            <div className="pagination">
                <button
                    className="no-border"
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                >
                    {/* {' '}
                    {'<<'}{' '} */}
                    <FontAwesomeIcon icon={faAngleDoubleLeft} />
                </button>
                <button
                    className="no-border"
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                >
                    {/* {' '}
                    {'<'}{' '} */}
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <button
                    className="no-border"
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                >
                    {/* {' '}
                    {'>'}{' '} */}
                    <FontAwesomeIcon icon={faAngleRight} />
                </button>
                <button
                    className="no-border"
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                >
                    {/* {' '}
                    {'>>'}{' '} */}
                    <FontAwesomeIcon icon={faAngleDoubleRight} />
                </button>
                <span>
                    {' '}
                    Page{' '}
                    <strong>
                        {' '}
                        {pageIndex + 1} of {pageOptions.length}{' '}
                    </strong>{' '}
                    &nbsp;{' '}
                </span>

                <select
                    className="dropdown select-simplified-style pagesize"
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[5, 10, 15].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}
export default TableContainer

// ----  THIS CODE IS FOR THE FILTERS USED IN THE TABLE COMPONENT ------

/* code for search filters */
export const Filter = ({ column }) => {
    return (
        <div className="filter-search-box-cell" style={{ marginTop: 5 }}>
            {column.canFilter && column.render('Filter')}
        </div>
    )
}

/* for text input filter-search box */
const DefaultColumnFilter = ({
    column: {
        filterValue,
        setFilter,
        preFilteredRows: { length }
    }
}) => {
    return (
        <div className="input-search-box-container">
            <FontAwesomeIcon icon={faSearch} />
            <input
                className="input-search-box"
                value={filterValue || ''}
                onChange={(e) => {
                    setFilter(e.target.value || undefined)
                }}
                // placeholder={[`!`, <FontAwesomeIcon icon={faSearch} />]}
                // placeholder={`\\xf002`}
                placeholder={``}
            />
        </div>
    )
}

/* for dropdown filter-search box */
export const SelectColumnFilter = ({
    column: { filterValue, setFilter, preFilteredRows, id }
}) => {
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach((row) => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    return (
        <select
            id="custom-select"
            type="select"
            value={filterValue}
            onChange={(e) => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option> --Select-- </option>
            <option value="">All</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    )
}
