// SlideGeneratorPage.jsx — Backend‑Only Version (Clean)

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { getCurriculum } from "../../services/api";
import { generateFromPptxTemplate } from "../../services/generationApi";
import "./SlideGenerator.css";

const SlideGeneratorPage = () => {
  const location = useLocation();
  const templateName =
    new URLSearchParams(location.search).get("template") || "";

  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedTopicId, setExpandedTopicId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Metadata fields for DTO
  const [fields, setFields] = useState({
    Title: "",
    Summary: "",
    Objectives: "",
    ExampleText: "",
    Explanation: "",
    Url: "",
    Source: "",
    Type: "",
    Description: "",
    FormulaText: "",
  });

  // Grade options
  const gradeOptions = {
    grade1: {
      name: "Cấp 1",
      description: "Lớp 1 - Lớp 5",
      classes: ["Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5"],
      gradeValue: "Cấp 1",
    },
    grade2: {
      name: "Cấp 2",
      description: "Lớp 6 - Lớp 9",
      classes: ["Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9"],
      gradeValue: "Cấp 2",
    },
    grade3: {
      name: "Cấp 3",
      description: "Lớp 10 - Lớp 12",
      classes: ["Lớp 10", "Lớp 11", "Lớp 12"],
      gradeValue: "Cấp 3",
    },
  };

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
    setSelectedClass(null);
    setTopics([]);
    setSelectedTopicId(null);
    setError(null);
  };

  const handleClassSelect = async (className) => {
    setSelectedClass(className);
    await fetchTopics(className, selectedGrade);
  };

  const fetchTopics = async (className, gradeKey) => {
    setLoading(true);
    setError(null);
    try {
      const gradeName = gradeOptions[gradeKey].gradeValue;
      const res = await getCurriculum(gradeName, className);
      if (Array.isArray(res.data)) setTopics(res.data);
      else setError("Dữ liệu không hợp lệ.");
    } catch (err) {
      console.error(err);
      setError("Không thể tải chủ đề.");
    } finally {
      setLoading(false);
    }
  };

  const selectTopic = (topic) => {
    setExpandedTopicId((prev) =>
      prev === topic.topicID ? null : topic.topicID
    );
    setSelectedTopicId(topic.topicID);

    const first = topic.contents?.[0];
    if (first) {
      setFields((prev) => ({
        ...prev,
        Title: first.title || prev.Title,
        Summary: first.summary || prev.Summary,
      }));
    }
  };

  const updateField = (key, value) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  // Backend call — must be async
  const handleGenerate = async () => {
    if (!templateName) return alert("Không có TemplateName từ URL.");
    if (!selectedTopicId) return alert("Bạn phải chọn chủ đề.");

    const payload = {
      TopicId: selectedTopicId,
      TemplateName: templateName,
      ...fields,
    };

    setIsGenerating(true);

    try {
      const res = await generateFromPptxTemplate(payload);

      // Expecting axios response with blob (responseType: 'blob')
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // prefer filename from content-disposition if provided
      const contentDisposition =
        res.headers?.["content-disposition"] ||
        res.headers?.["Content-Disposition"];
      if (contentDisposition) {
        const match =
          contentDisposition.match(/filename\*=UTF-8''([^;\n]+)/i) ||
          contentDisposition.match(/filename=\"?([^\";\n]+)\"?/i);
        if (match) {
          try {
            a.download = decodeURIComponent(match[1]);
          } catch {
            a.download = match[1];
          }
        } else {
          a.download = templateName;
        }
      } else {
        a.download = templateName;
      }

      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Lỗi tạo slide từ server", err);
      alert("Lỗi tạo slide từ server.");
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

      {/* Grade selection */}
      <h2 className="section-title">Chọn Cấp</h2>
      <div className="grade-container">
        {Object.entries(gradeOptions).map(([key, g]) => (
          <div
            key={key}
            className={`grade-card ${selectedGrade === key ? "active" : ""}`}
            onClick={() => handleGradeSelect(key)}
          >
            <h3>{g.name}</h3>
            <p>{g.description}</p>
          </div>
        ))}
      </div>

      {/* Class selection */}
      {selectedGrade && (
        <>
          <h2 className="section-title">Chọn Lớp</h2>
          <div className="class-container">
            {gradeOptions[selectedGrade].classes.map((c) => (
              <button
                key={c}
                className={`class-btn ${selectedClass === c ? "active" : ""}`}
                onClick={() => handleClassSelect(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Topics */}
      {selectedClass && (
        <div className="topics-block">
          <h2 className="section-title">Chọn Chủ Đề</h2>
          {loading && <p>Đang tải...</p>}
          {error && <p className="error-msg">{error}</p>}

          {topics.map((topic) => (
            <div key={topic.topicID} className="topic-card">
              <div className="topic-header" onClick={() => selectTopic(topic)}>
                <div>
                  <h3>{topic.topicName}</h3>
                  <p>{topic.strandName}</p>
                </div>
                <span>{expandedTopicId === topic.topicID ? "▼" : "▶"}</span>
              </div>

              {expandedTopicId === topic.topicID && (
                <div className="topic-contents">
                  {(topic.contents || []).map((cnt) => (
                    <div key={cnt.contentID} className="content-row">
                      <div>
                        <h4>{cnt.title}</h4>
                        <p>{cnt.summary}</p>
                      </div>
                      <button
                        className="use-btn"
                        onClick={() => {
                          setFields({
                            ...fields,
                            Title: cnt.title || "",
                            Summary: cnt.summary || "",
                          });
                          setSelectedTopicId(topic.topicID);
                        }}
                      >
                        Dùng Nội Dung
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Metadata Fields */}
      {selectedTopicId && (
        <div className="metadata-block">
          <h2 className="section-title">Thông Tin Bổ Sung</h2>

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
            placeholder="Mục tiêu"
            value={fields.Objectives}
            onChange={(e) => updateField("Objectives", e.target.value)}
          />
          <input
            placeholder="Source"
            value={fields.Source}
            onChange={(e) => updateField("Source", e.target.value)}
          />
          <input
            placeholder="URL"
            value={fields.Url}
            onChange={(e) => updateField("Url", e.target.value)}
          />
          <input
            placeholder="Mô tả"
            value={fields.Description}
            onChange={(e) => updateField("Description", e.target.value)}
          />
          <input
            placeholder="Công thức"
            value={fields.FormulaText}
            onChange={(e) => updateField("FormulaText", e.target.value)}
          />
        </div>
      )}

      {/* Generate Button */}
      {selectedTopicId && (
        <button className="generate-btn" onClick={handleGenerate}>
          🚀 Tạo Slide Từ Template
        </button>
      )}

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
