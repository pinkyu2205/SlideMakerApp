// SlideGeneratorPage.jsx

import React, { useState } from "react";
import { getCurriculum } from "../../services/api";
import PptxGenJS from "pptxgenjs";
import "./SlideGenerator.css";

// --- Simple helper: convert a long text into bullets ---
const textToBullets = (text, maxBullets = 5) => {
  if (!text) return [];
  // split by sentences or commas, fallback to fixed-size chunks
  const sentences = text
    .split(/(?<=[.!?])\s+|,\s+|;\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length === 0) return [];
  if (sentences.length <= maxBullets) return sentences;

  // pick the longest ones or first ones
  return sentences.slice(0, maxBullets);
};

const defaultTheme = {
  titleFontSize: 28,
  bodyFontSize: 18,
  titleColor: "#ffffff",
  bodyColor: "#111827",
  background: "#6366f1", // used in preview
};

const SlideGeneratorPage = () => {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedTopicId, setExpandedTopicId] = useState(null);

  // slide-building state
  const [slidesPreview, setSlidesPreview] = useState([]); // array of {title, bullets, image, theme}
  const [slideCount, setSlideCount] = useState(3);
  const [selectedTheme, setSelectedTheme] = useState(defaultTheme);
  const [autoGenerateMode, setAutoGenerateMode] = useState(true);

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

  const handleGradeSelect = (gradeKey) => {
    setSelectedGrade(gradeKey);
    setSelectedClass(null);
    setTopics([]);
    setError(null);
  };

  const handleClassSelect = async (className) => {
    setSelectedClass(className);
    setExpandedTopicId(null);
    await fetchTopics(className, selectedGrade);
  };

  const fetchTopics = async (className, gradeKey) => {
    if (!gradeKey) return;
    try {
      setLoading(true);
      setError(null);

      const gradeName = gradeOptions[gradeKey].gradeValue;
      const response = await getCurriculum(gradeName, className);

      if (response.data && Array.isArray(response.data)) {
        setTopics(response.data);
      } else {
        setTopics([]);
        setError("Dữ liệu không hợp lệ. Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Không thể tải chương trình học");
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopicExpand = (topicId) => {
    setExpandedTopicId((prev) => (prev === topicId ? null : topicId));
  };

  // --- Auto-generate slides from a content item ---
  const autoGenerateSlidesFromContent = (content, numberOfSlides = 3) => {
    // simple strategy: produce up to numberOfSlides slide objects
    // 1. Title slide (topic or content.title)
    // 2..n. Split content.summary into bullets distributed across slides
    const title = content.title || content.contentName || "Slide";
    const summary = content.summary || "";
    const bullets = textToBullets(summary, 12);

    const slides = [];

    // Slide 1: Title + few bullets
    slides.push({
      title: title,
      bullets: bullets.slice(0, 3),
      image: content.imageUrl || null,
      theme: selectedTheme,
    });

    // remaining slides: spread remainder of bullets
    const remaining = bullets.slice(3);
    if (remaining.length === 0 && numberOfSlides > 1) {
      // create generic slides with the main points repeated or empty
      for (let i = 1; i < numberOfSlides; i++) {
        slides.push({
          title: `${title} - Phần ${i + 1}`,
          bullets: [],
          image: null,
          theme: selectedTheme,
        });
      }
    } else {
      const perSlide = Math.max(
        1,
        Math.ceil(remaining.length / Math.max(1, numberOfSlides - 1))
      );
      for (let i = 0; i < numberOfSlides - 1; i++) {
        const start = i * perSlide;
        const chunk = remaining.slice(start, start + perSlide);
        if (chunk.length === 0) break;
        slides.push({
          title: `${title} - Phần ${i + 2}`,
          bullets: chunk,
          image: null,
          theme: selectedTheme,
        });
      }
    }

    return slides;
  };

  const handleAddContentToSlides = (content) => {
    const generated = autoGenerateSlidesFromContent(content, slideCount);
    setSlidesPreview((prev) => [...prev, ...generated]);
  };

  const handleClearPreview = () => setSlidesPreview([]);

  // --- Export to PPTX using pptxgenjs ---
  const exportToPptx = async (fileName = "Lesson-Slides") => {
    if (slidesPreview.length === 0) return alert("Không có slide để xuất.");

    const pres = new PptxGenJS();

    slidesPreview.forEach((s) => {
      const slide = pres.addSlide();

      // simple background
      if (s.theme && s.theme.background) {
        slide.background = { fill: s.theme.background };
      }

      // Title
      slide.addText(s.title || "", {
        x: 0.5,
        y: 0.4,
        w: "90%",
        h: 1.0,
        fontSize: s.theme?.titleFontSize || 28,
        color: s.theme?.titleColor || "FFFFFF",
        bold: true,
      });

      // Image if exists (uses remote URL)
      if (s.image) {
        try {
          slide.addImage({ x: 0.6, y: 1.5, w: 4.5, h: 3.0, url: s.image });
        } catch (e) {
          // ignore image failures in client export
        }
      }

      // Bullets
      if (s.bullets && s.bullets.length > 0) {
        const bodyText = s.bullets.map((b) => `• ${b}`).join("\n");
        slide.addText(bodyText, {
          x: 0.6,
          y: s.image ? 4.6 : 1.6,
          w: "80%",
          h: 3.0,
          fontSize: s.theme?.bodyFontSize || 18,
          color: s.theme?.bodyColor || "111827",
        });
      }
    });

    await pres.writeFile({ fileName });
  };

  // --- Hand-edit single slide in preview ---
  const updatePreviewSlide = (index, patch) => {
    setSlidesPreview((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s))
    );
  };

  return (
    <div className="slide-gen-container">
      <div className="slide-gen-left">
        <div className="slide-gen-header">
          <h1>Tạo Slide Từ Nội Dung</h1>
          <p>
            Chọn cấp, lớp, chủ đề, sau đó chọn nội dung để auto-generate slide.
          </p>
        </div>

        <div className="grade-section">
          <h3>Chọn Cấp</h3>
          <div className="grade-cards">
            {Object.entries(gradeOptions).map(([gradeKey, gradeData]) => (
              <div
                key={gradeKey}
                className={`grade-card ${
                  selectedGrade === gradeKey ? "active" : ""
                }`}
                onClick={() => handleGradeSelect(gradeKey)}
              >
                <div>
                  <div className="grade-name">{gradeData.name}</div>
                  <div className="grade-desc">{gradeData.description}</div>
                </div>
                <div className="grade-check">
                  {selectedGrade === gradeKey ? "✓" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedGrade && (
          <div className="class-section">
            <h3>Chọn Lớp</h3>
            <div className="class-buttons">
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
          </div>
        )}

        {selectedClass && (
          <div className="topics-section">
            <h3>Chủ Đề</h3>
            {loading && <div className="loading">Đang tải...</div>}
            {error && <div className="error">{error}</div>}
            {!loading && !error && topics.length === 0 && (
              <div className="no-topics">Chưa có chủ đề</div>
            )}
            {!loading && topics.length > 0 && (
              <div className="topics-list">
                {topics.map((topic) => (
                  <div key={topic.topicID} className="topic-row">
                    <div
                      className="topic-main"
                      onClick={() => toggleTopicExpand(topic.topicID)}
                    >
                      <div>
                        <div className="topic-name">{topic.topicName}</div>
                        <div className="topic-strand">{topic.strandName}</div>
                      </div>
                      <div>{expandedTopicId === topic.topicID ? "▼" : "▶"}</div>
                    </div>

                    {expandedTopicId === topic.topicID && (
                      <div className="topic-contents">
                        {topic.contents && topic.contents.length > 0 ? (
                          topic.contents.map((content) => (
                            <div
                              key={content.contentID}
                              className="content-row"
                            >
                              <div className="content-info">
                                <div className="content-title">
                                  {content.title}
                                </div>
                                <div className="content-summary">
                                  {content.summary}
                                </div>
                              </div>
                              <div className="content-actions">
                                <button
                                  onClick={() =>
                                    handleAddContentToSlides(content)
                                  }
                                  className="btn-small"
                                >
                                  ✨ Thêm và Tạo Slide
                                </button>
                                <button
                                  onClick={() =>
                                    updatePreviewSlide(slidesPreview.length, {
                                      title: content.title,
                                      bullets: textToBullets(
                                        content.summary,
                                        5
                                      ),
                                      image: content.imageUrl || null,
                                      theme: selectedTheme,
                                    })
                                  }
                                  className="btn-small-outline"
                                >
                                  Thêm vào Preview
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="no-contents">
                            Chủ đề này không có nội dung
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Slide options */}
        <div className="slide-options">
          <h3>Tùy Chọn Slide</h3>
          <div className="row">
            <label>Số lượng slide mỗi nội dung</label>
            <input
              type="number"
              min={1}
              max={10}
              value={slideCount}
              onChange={(e) => setSlideCount(parseInt(e.target.value || "1"))}
            />
          </div>

          <div className="row">
            <label>Chế độ</label>
            <select
              value={autoGenerateMode ? "auto" : "manual"}
              onChange={(e) => setAutoGenerateMode(e.target.value === "auto")}
            >
              <option value="auto">Tự động (Auto-generate)</option>
              <option value="manual">Thủ công (Chỉnh sửa sau)</option>
            </select>
          </div>

          <div className="row">
            <label>Chủ đề giao diện</label>
            <select
              onChange={(e) =>
                setSelectedTheme({
                  ...selectedTheme,
                  background: e.target.value,
                })
              }
              value={selectedTheme.background}
            >
              <option value="#6366f1">Tím gradient</option>
              <option value="#0ea5a4">Xanh biển</option>
              <option value="#f97316">Cam</option>
              <option value="#111827">Tối</option>
            </select>
          </div>
        </div>
      </div>

      <div className="slide-gen-right">
        <div className="preview-header">
          <h3>Preview Slides ({slidesPreview.length})</h3>
          <div className="preview-actions">
            <button
              className="btn-primary"
              onClick={() => exportToPptx("Lesson-Slides")}
            >
              ⤓ Xuất PPTX
            </button>
            <button className="btn" onClick={handleClearPreview}>
              🗑 Xóa Preview
            </button>
          </div>
        </div>

        <div className="preview-area">
          {slidesPreview.length === 0 && (
            <div className="empty-preview">
              Chưa có slide. Thêm nội dung để bắt đầu.
            </div>
          )}

          {slidesPreview.map((s, i) => (
            <div key={i} className="preview-card">
              <div
                className="preview-thumb"
                style={{ background: s.theme?.background || "#ddd" }}
              >
                <div className="preview-title">{s.title}</div>
                <div className="preview-bullets">
                  {s.bullets &&
                    s.bullets.slice(0, 4).map((b, idx) => (
                      <div key={idx} className="preview-bullet">
                        • {b}
                      </div>
                    ))}
                </div>
              </div>

              <div className="preview-controls">
                <button
                  className="btn-small"
                  onClick={() => {
                    const newTitle = prompt("Chỉnh sửa tiêu đề", s.title);
                    if (newTitle !== null)
                      updatePreviewSlide(i, { title: newTitle });
                  }}
                >
                  ✏️
                </button>
                <button
                  className="btn-small-outline"
                  onClick={() =>
                    setSlidesPreview((prev) =>
                      prev.filter((_, idx) => idx !== i)
                    )
                  }
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlideGeneratorPage;
