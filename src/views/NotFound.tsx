import { colors } from "@material-ui/core";
import { Container, Row, Col, Card } from "react-bootstrap";

export function NotFound() {
  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h6 style={{ color: colors.grey[600] }}>Sorry the page your looking for was not found (404)</h6>
            </Card.Body>

          </Card>
        </Col>
      </Row>
    </Container>
  );
}