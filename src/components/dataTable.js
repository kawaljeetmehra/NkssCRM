import React, { useEffect, useState } from "react";

const DataTableComponent = ({ data, Heading, value }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [Existingdata, setExistingData] = useState(data);

  useEffect(() => {
    if (!value) {
      setExistingData(data);
    } else {
      const filterData = data.filter(item =>
        item.Employee.toLowerCase().includes(value.toLowerCase())
      );
      setExistingData(filterData);
    }
  }, [data, value]);

  useEffect(() => {
    setCurrentPage(1); // Reset current page when data or value changes
  }, [data, value]);

  const renderRows = () => {
    const rows = [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, Existingdata.length);
    for (let i = startIndex; i < endIndex; i++) {
      const tdata = Heading.map(element => (
        <td key={element}>
          {element === "Profile" ? (
            <img
              src={Existingdata[i][element]}
              alt="profile"
              className="bg-soft-primary rounded img-fluid avatar-40 me-3"
            />
          ) : (
            Existingdata[i][element]
          )}
        </td>
      ));
      rows.push(<tr key={i}>{tdata}</tr>);
    }
    return rows;
  };

  const totalPages = Math.ceil(Existingdata.length / itemsPerPage);
  const maxVisiblePages = 5;

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const pagination = (
    <nav aria-label="Page navigation">
      <ul className="pagination pagination-lg" style={{ marginLeft: "40px" }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
          if (
            totalPages <= maxVisiblePages ||
            page === 1 ||
            page === currentPage ||
            (page >= currentPage - 2 && page <= currentPage + 2) ||
            page === totalPages
          ) {
            return (
              <li
                key={page}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <a
                  className="page-link"
                  href="#"
                  onClick={() => handlePageChange(page)}
                  style={{ fontSize: "12px" }}
                >
                  {page}
                </a>
              </li>
            );
          } else if (
            (page === 2 && currentPage - maxVisiblePages > 2) ||
            (page === totalPages - 1 && currentPage + maxVisiblePages < totalPages)
          )
            return null;
        })}
      </ul>
    </nav>
  );

  return (
    <>
      <div className="card-body px-0">
        <div className="table-responsive">
          <table
            id="user-list-table"
            className="table table-striped"
            role="grid"
            data-toggle="data-table"
            style={{ borderRadius: "30px" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#4B3144", color: "white" }}>
                {Heading.map(item => (
                  <th key={item}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderRows().length === 0 ? (
                <tr>
                  <td colSpan={Heading.length}>
                    <h5 style={{ color: "grey", textAlign: "center" }}>No Record Found</h5>
                  </td>
                </tr>
              ) : (
                renderRows()
              )}
            </tbody>
          </table>
        </div>
        {pagination}
      </div>
    </>
  );
};

export default DataTableComponent;
