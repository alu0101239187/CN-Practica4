import React from "react";
import { useParams } from "react-router-dom";
import {
  fetchServiceByName,
  sendServiceData,
} from "../controllers/servicesController";
import {
  Container,
  Typography,
  Grid,
  Card,
  CircularProgress,
  Button,
} from "@mui/material";
import ErrorAlert from "../components/ErrorAlert";

export default function Service() {
  const { name: name } = useParams();
  const [service, setService] = React.useState(null);
  const [result, setResult] = React.useState(null);
  const [loadingResult, setLoadingResult] = React.useState(false);
  const [error, setError] = React.useState(null);

  const submitServiceData = async (form) => {
    // Load the form data
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const formData = new FormData();
    service.args.forEach((arg) => {
      const input = document.querySelector(`#${arg.name}`);
      if (arg.type === "file") {
        if (input && input.files.length > 0) {
          formData.append("file", input.files[0]);
        }
      } else {
        if (input && input.value !== "") {
          formData.append(arg.name, input.value);
        }
      }
    });
    // Send the form data to the server
    try {
      setLoadingResult(true);
      const response = await sendServiceData(name, formData);
      if (service.response.type === "file") {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([response]));
        link.download = `download.${service.response.extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.log(response);
        setResult(response.output);
      }
      setLoadingResult(false);
    } catch (err) {
      setLoadingResult(false);
      setError(err.message);
    }
  };

  React.useEffect(() => {
    const loadService = async () => {
      try {
        const data = await fetchServiceByName(name);
        setService(data);
      } catch (err) {
        setError(err.message);
      }
    };
    loadService();
  }, [name]);

  if (!service)
    return (
      <Container
        disableGutters
        sx={{
          width: "100%",
        }}
      >
        <CircularProgress
          color="primary"
          style={{
            marginTop: "20vh",
          }}
        />
        <ErrorAlert
          open={Boolean(error)}
          error={error}
          onClose={() => setError("")}
        />
      </Container>
    );

  return (
    <Container
      disableGutters
      sx={{
        width: "100%",
        padding: "20px 40px",
      }}
    >
      <Card
        sx={{
          flexDirection: "column",
          display: "flex",
          boxShadow: 5,
          borderRadius: "0px",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", textAlign: "center", marginTop: "40px" }}
        >
          {service.name}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
          {service.description}
        </Typography>
        <form
          id="serviceForm"
          style={{
            marginTop: "30px",
            width: "100%",
          }}
        >
          <Grid
            container
            rowSpacing={3}
            columnSpacing={6}
            fullWidth
            sx={{ justifyContent: "center", marginBottom: "30px" }}
          >
            {service.args.map((arg) => (
              <Grid key={arg.name} size={{ xs: 12, md: 4 }}>
                <Typography
                  variant="body1"
                  sx={{ marginBottom: "10px", textAlign: "center" }}
                >
                  {arg.description}
                </Typography>
                <input
                  id={arg.name}
                  name={arg.name}
                  type={arg.type}
                  required={arg.required}
                  placeholder={arg.placeholder}
                  style={{
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    width: "80%",
                  }}
                />
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            size="large"
            style={{
              backgroundColor: "#48A6A7",
              cursor: "pointer",
            }}
            onClick={async () => {
              submitServiceData(document.querySelector("#serviceForm"));
            }}
          >
            Ejecutar servicio
          </Button>
        </form>
        <div
          style={{
            margin: "30px",
            textAlign: "center",
            visibility: loadingResult || result ? "visible" : "hidden",
            minHeight: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: result ? "1px solid #ccc" : "none",
          }}
        >
          {loadingResult ? (
            <CircularProgress color="primary" />
          ) : (
            result && <Typography variant="body1">{result}</Typography>
          )}
        </div>
      </Card>
      <ErrorAlert
        open={Boolean(error)}
        error={error}
        onClose={() => setError("")}
      />
    </Container>
  );
}
