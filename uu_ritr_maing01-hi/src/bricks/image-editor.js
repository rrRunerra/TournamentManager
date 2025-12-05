import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import FilerobotImageEditor, {
    TABS,
    TOOLS,
} from 'react-filerobot-image-editor';

// Import local diploma templates
import diploma1 from '../assets/matchup_diploma_1.jpg';
import diploma2 from '../assets/matchup_diploma_2.jpg';
import diploma3 from '../assets/matchup_diploma_3.jpg';

// Import styles
import '../styles/image-editor.css';

// Predefined diploma templates
const DIPLOMA_TEMPLATES = [
    {
        id: 1,
        name: 'MatchUP Diploma 1',
        url: diploma1,
    },
    {
        id: 2,
        name: 'MatchUP Diploma 2',
        url: diploma2,
    },
    {
        id: 3,
        name: 'MatchUP Diploma 3',
        url: diploma3,
    },
];

// Theme configuration matching app colors with good text visibility
const EDITOR_THEME = {
    palette: {
        'bg-secondary': '#1a1a1a',
        'bg-primary': '#0f0f0f',
        'bg-primary-active': '#2a2a2a',
        'accent-primary': '#ff8e53',
        'accent-primary-active': '#ffd166',
        'icons-primary': '#ff8e53',
        'icons-secondary': '#ff8e53',
        'borders-secondary': '#444444',
        'borders-primary': '#555555',
        'borders-strong': '#ff8e53',
        'light-shadow': 'rgba(255, 142, 83, 0.3)',
        'warning': '#ff4d4d',
        'txt-primary': '#ff8e53',
        'txt-secondary': '#ffffff',
        'txt-secondary-invert': '#ffffff',
        'txt-placeholder': '#888888',
        'btn-primary-text': '#000000',
    },
    typography: {
        fontFamily: 'Space Grotesk, Arial, sans-serif',
    },
};

export default function ImgEditor({ isImgEditorShown, closeImgEditor }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const fileInputRef = useRef(null);

    const handleTemplateSelect = (templateUrl) => {
        setSelectedImage(templateUrl);
        setIsEditorOpen(true);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
                setIsEditorOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClose = () => {
        setSelectedImage(null);
        setIsEditorOpen(false);
        closeImgEditor();
    };

    const handleEditorClose = (closingReason) => {
        console.log('Editor closed:', closingReason);
        setSelectedImage(null);
        setIsEditorOpen(false);
    };

    const handleSave = (editedImageObject, designState) => {
        console.log('Saving diploma...', editedImageObject);

        if (editedImageObject.imageBase64) {
            const link = document.createElement('a');
            link.href = editedImageObject.imageBase64;
            link.download = editedImageObject.fullName || 'diploma.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (!isImgEditorShown) return null;

    // Template selection modal
    if (!isEditorOpen) {
        return ReactDOM.createPortal(
            <div className="image-editor-overlay">
                <div className="image-editor-modal">
                    <div className="image-editor-header">
                        <h2 className="image-editor-title">
                            Select Diploma Template
                        </h2>
                        <button
                            onClick={handleClose}
                            className="image-editor-close-btn"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="image-editor-templates">
                        {DIPLOMA_TEMPLATES.map((template) => (
                            <div
                                key={template.id}
                                onClick={() => handleTemplateSelect(template.url)}
                                className="image-editor-template-card"
                            >
                                <img
                                    src={template.url}
                                    alt={template.name}
                                    className="image-editor-template-img"
                                />
                                <div className="image-editor-template-name">
                                    {template.name}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Upload Custom Image */}
                    <div className="image-editor-upload-section">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="image-editor-file-input"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="image-editor-upload-btn"
                        >
                            📁 Upload Your Own Image
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        );
    }

    // Image Editor - use portal to render at body level
    return ReactDOM.createPortal(
        <div className="image-editor-container">
            <FilerobotImageEditor
                source={selectedImage}
                onSave={handleSave}
                onClose={handleEditorClose}

                // Apply custom theme
                theme={EDITOR_THEME}

                // Text tool configuration
                Text={{
                    text: 'Winner Name',
                    fontFamily: 'Arial',
                    fonts: [
                        { label: 'Arial', value: 'Arial' },
                        { label: 'Times New Roman', value: 'Times New Roman' },
                        { label: 'Georgia', value: 'Georgia' },
                        { label: 'Verdana', value: 'Verdana' },
                        { label: 'Tahoma', value: 'Tahoma' },
                        { label: 'Trebuchet MS', value: 'Trebuchet MS' },
                        { label: 'Courier New', value: 'Courier New' },
                    ],
                    fontSize: 28,
                    letterSpacing: 0,
                    lineHeight: 1.2,
                    align: 'center',
                }}

                // Rotate configuration
                Rotate={{
                    angle: 90,
                    componentType: 'slider',
                }}

                // Crop configuration
                Crop={{
                    presetsItems: [
                        {
                            titleKey: 'diplomaLandscape',
                            descriptionKey: 'A4 Landscape',
                            ratio: 297 / 210,
                        },
                        {
                            titleKey: 'diplomaPortrait',
                            descriptionKey: 'A4 Portrait',
                            ratio: 210 / 297,
                        },
                        {
                            titleKey: 'widescreen',
                            descriptionKey: '16:9',
                            ratio: 16 / 9,
                        },
                        {
                            titleKey: 'square',
                            descriptionKey: '1:1',
                            ratio: 1,
                        },
                    ],
                }}

                // Tab configuration
                tabsIds={[
                    TABS.ADJUST,
                    TABS.FINETUNE,
                    TABS.FILTERS,
                    TABS.WATERMARK,
                    TABS.ANNOTATE,
                    TABS.RESIZE,
                ]}
                defaultTabId={TABS.ANNOTATE}
                defaultToolId={TOOLS.TEXT}

                // Save configuration
                defaultSavedImageName="diploma"
                defaultSavedImageType="png"
                defaultSavedImageQuality={0.92}

                // Quality settings
                savingPixelRatio={2}
                previewPixelRatio={2}
            />
        </div>,
        document.body
    );
}