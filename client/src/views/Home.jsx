import React from "react";
import { CircularProgress, Typography } from "@mui/material";
import { fetchServices } from "../controllers/servicesController";
import ErrorAlert from "../components/ErrorAlert";

function Home() {
  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const loadServices = async () => {
      try {
        const services = await fetchServices();
        setServices(services);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    loadServices();
  }, []);

  if (error) return <ErrorAlert open={Boolean(error)} error={error} />;
  if (loading)
    return (
      <CircularProgress
        color="primary"
        style={{
          marginTop: "20vh",
        }}
      />
    );
  if (services.length === 0) {
    return (
      <div>
        <Typography variant="h6" gutterBottom>
          No hay servicios disponibles
        </Typography>
      </div>
    );
  }
  return (
    <div>
      {services.map((service) => (
        <div
          key={service.id}
          style={{
            margin: "20px 40px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "background-color 0.3s",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            backgroundColor: "white",
          }}
          onClick={() => (window.location.href = `/services/${service.url}`)}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#f0f0f0")
          }
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "white")}
        >
          <Typography variant="h6" gutterBottom style={{ fontWeight: "bold" }}>
            {service.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {service.description}
          </Typography>
        </div>
      ))}
    </div>
  );
}

export default Home;
