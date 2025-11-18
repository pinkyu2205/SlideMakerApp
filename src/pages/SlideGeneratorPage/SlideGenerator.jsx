import { useLocation } from "react-router-dom";
import { generateFromPptxTemplate } from "../../services/generationApi";
import "./SlideGenerator.css";
import React, { useState, useEffect } from "react";

// Slide Generator Page — Version using Option B (metadata passed from OptionsTemplatePage)
const SlideGeneratorPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const templateId = params.get("templateId");
  const topicId = params.get("topicId");

  // Extract metadata from URL (Preset 3 — Full recommended)
  const [fields, setFields] = useState({
    Title: params.get("title") || "",
    Summary: params.get("summary") || "",
    Description: params.get("summary") || "",
    Type: params.get("topicName") || "",
    Objectives: "",
    ExampleText: "",
    Explanation: "",
    Url: "",
    Source: "GDPT",
    FormulaText: "",
  });

  const [templateName, setTemplateName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Load template metadata from backend using templateId
  useEffect(() => {
    if (!templateId) return;

    (async () => {
      try {
        const res = await fetch(`/api/template/${templateId}`);
        const data = await res.json();
        setTemplateName(data.templateName || data.name || "Không rõ");
      } catch (e) {
        console.error("Error loading template", e);
      }
    })();
  }, [templateId]);

  const updateField = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  // Generate slide
  const handleGenerate = async () => {
    if (!templateName) return alert("Không tìm thấy template.");
    if (!topicId) return alert("Không có Topic ID.");

    const payload = {
      TopicId: topicId,
      TemplateName: templateName + ".pptx",
      ...fields,
    };

    setIsGenerating(true);

    try {
      const res = await generateFromPptxTemplate(payload);

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = payload.TemplateName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Lỗi tạo slide từ server", err);
      alert("Lỗi tạo slide từ server.");
      alert(payload.TemplateName);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="slidegen-page">
      <h1 className="page-title">Tạo Slide từ Template</h1>

      <p className="template-info">
        Template đang dùng: <strong>{templateName}</strong>
      </p>

      <button
        className="choose-template-btn"
        onClick={() => {
          window.location.href = "/templates?returnTo=slide-generator";
        }}
      >
        📂 Chọn Template
      </button>

      <h2 className="section-title">Thông Tin Slide</h2>

      {/* Metadata Fields */}
      <div className="metadata-block">
        <input
          placeholder="Tiêu đề"
          value={fields.Title}
          onChange={(e) => updateField("Title", e.target.value)}
        />

        <textarea
          placeholder="Tóm tắt"
          value={fields.Summary}
          onChange={(e) => updateField("Summary", e.target.value)}
        />

        <textarea
          placeholder="Mô tả"
          value={fields.Description}
          onChange={(e) => updateField("Description", e.target.value)}
        />

        <input
          placeholder="Loại nội dung"
          value={fields.Type}
          onChange={(e) => updateField("Type", e.target.value)}
        />

        <textarea
          placeholder="Giải thích"
          value={fields.Explanation}
          onChange={(e) => updateField("Explanation", e.target.value)}
        />

        <input
          placeholder="Ví dụ"
          value={fields.ExampleText}
          onChange={(e) => updateField("ExampleText", e.target.value)}
        />

        <input
          placeholder="Công thức"
          value={fields.FormulaText}
          onChange={(e) => updateField("FormulaText", e.target.value)}
        />
      </div>

      {/* Generate Button */}
      <button className="generate-btn" onClick={handleGenerate}>
        🚀 Tạo Slide Từ Template
      </button>

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="overlay">
          <div className="spinner"></div>
          <p className="loading-text">Đang tạo slide...</p>
        </div>
      )}
    </div>
  );
};

export default SlideGeneratorPage;
