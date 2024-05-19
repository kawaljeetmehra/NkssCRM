import React, { useState } from "react";
import { Wrapper } from "../header";
import DataTableComponent from "../../components/dataTable";
import { Card, Col, Row } from "react-bootstrap";

const UsersList = () => {

  return (
    <>
      <Wrapper>
        <Row>
          <Col className="col-sm-12">
            <Card>
              <Card.Header className="d-flex justify-content-between">
                <div className="header-title">
                  <h4 className="card-title">User List</h4>
                </div>
              </Card.Header>
              <DataTableComponent />
            </Card>
          </Col>
        </Row>
      </Wrapper>
    </>
  );
};

export default UsersList;
