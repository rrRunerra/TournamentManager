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
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99999,
                background: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{
                    background: '#0f0f0f',
                    borderRadius: '16px',
                    padding: '32px',
                    maxWidth: '800px',
                    width: '90%',
                    border: '1px solid #333',
                    boxShadow: '0 0 20px rgba(255, 140, 0, 0.25)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ color: '#ffd166', margin: 0, fontFamily: 'Space Grotesk' }}>
                            Select Diploma Template
                        </h2>
                        <button
                            onClick={handleClose}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#ff4d4d',
                                fontSize: '24px',
                                cursor: 'pointer',
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        marginBottom: '24px',
                    }}>
                        {DIPLOMA_TEMPLATES.map((template) => (
                            <div
                                key={template.id}
                                onClick={() => handleTemplateSelect(template.url)}
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '2px solid #333',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.border = '2px solid #ff8e53';
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.border = '2px solid #333';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <img
                                    src={template.url}
                                    alt={template.name}
                                    style={{
                                        width: '100%',
                                        height: '140px',
                                        objectFit: 'cover',
                                    }}
                                />
                                <div style={{
                                    padding: '12px',
                                    background: '#1a1a1a',
                                    color: '#fff',
                                    textAlign: 'center',
                                    fontFamily: 'Space Grotesk',
                                }}>
                                    {template.name}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Upload Custom Image */}
                    <div style={{ textAlign: 'center' }}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                padding: '14px 28px',
                                background: 'transparent',
                                border: '2px dashed #ff8e53',
                                borderRadius: '12px',
                                color: '#ff8e53',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                fontFamily: 'Space Grotesk',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 142, 83, 0.1)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
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
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 2,
        }}>
            <FilerobotImageEditor
                source={selectedImage}
                onSave={handleSave}
                onClose={handleEditorClose}

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