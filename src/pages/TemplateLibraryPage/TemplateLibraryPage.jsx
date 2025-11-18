import { useEffect, useState } from "react";
import TemplateCard from "../../components/TemplateCard/TemplateCard";
import { getAllTemplates, getBaseUrl } from "../../services/api"; // Import thêm getBaseUrl
import "./TemplateLibraryPage.css";
import { useNavigate } from "react-router-dom";

const TemplateLibraryPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await getAllTemplates(true);
        setTemplates(response.data);
        setError(null);
      } catch (err) {
        setError("Không thể tải danh sách template.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const navigate = useNavigate();

  const handleSelectTemplate = (id) => {
    const params = new URLSearchParams(location.search);
    const returnTo = params.get("returnTo");

    // Redirect back with templateId
    navigate(`/options-template?templateId=${id}`);
  };

  return (
    <div className="template-library-container">
      <h1 className="template-library-title">Thư viện Template</h1>
      <p className="template-library-subtitle">
        Chọn một template để bắt đầu tạo slide của bạn
      </p>

      {loading && <p style={{ tSextAlign: "center" }}>Đang tải templates...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="template-grid">
          {templates.map((template) => (
            <TemplateCard
              key={template.templateID}
              template={{
                ...template,
                thumbnailUrl: template.thumbnailUrl
                  ? `${getBaseUrl()}${template.thumbnailUrl}`
                  : "",
              }}
              onSelect={handleSelectTemplate}
            />
          ))}
        </div>
      )}

      {!loading && !error && templates.length === 0 && (
        <p
          style={{ textAlign: "center", gridColumn: "1/-1", color: "#6b7280" }}
        >
          Hiện chưa có template nào.
        </p>
      )}
    </div>
  );
};

export default TemplateLibraryPage;
