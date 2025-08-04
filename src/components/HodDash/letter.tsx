import React, { useState, useRef, useCallback } from 'react';
import logo from '../../assets/UR.png';
import {
    Save, Download, FileText, Printer, Eye, EyeOff, Copy, Send, Calendar,
    User, Building, Mail, Phone, MapPin, Palette, Type, AlignLeft,
    RefreshCw, Bold, Italic, Underline, List, ListOrdered, Link,
    AlignCenter, AlignRight, AlignJustify
} from 'lucide-react';
import { toast } from 'react-toastify';


// Rich Text Editor Component with Working Toolbar
type ReactQuillProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    modules?: any;
    formats?: any;
    theme?: string;
};

const ReactQuill: React.FC<ReactQuillProps> = ({ value, onChange, placeholder, modules, formats, theme = "snow" }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [currentFont, setCurrentFont] = useState('Times New Roman');
    const [currentSize, setCurrentSize] = useState('14px');

    // Execute formatting commands
    const execCommand = useCallback((command: string, value?: string) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
        // Refocus the editor
        editorRef.current?.focus();
    }, [onChange]);

    // Handle content changes
    const handleInput = useCallback(() => {
        if (editorRef.current) {
            // Ensure proper text direction
            const selection = window.getSelection();
            const range = selection?.getRangeAt(0);

            // Get the content and ensure it's properly formatted
            let content = editorRef.current.innerHTML;

            // Fix any direction issues
            content = content.replace(/dir="rtl"/g, 'dir="ltr"');
            content = content.replace(/direction:\s*rtl/g, 'direction: ltr');

            onChange(content);

            // Restore cursor position if needed
            if (range && selection) {
                try {
                    selection.removeAllRanges();
                    selection.addRange(range);
                } catch (e) {
                    // Ignore errors in cursor restoration
                }
            }
        }
    }, [onChange]);

    // Handle key commands (Ctrl+B, Ctrl+I, etc.)
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault();
                    execCommand('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    execCommand('italic');
                    break;
                case 'u':
                    e.preventDefault();
                    execCommand('underline');
                    break;
                case 'z':
                    e.preventDefault();
                    execCommand('undo');
                    break;
                case 'y':
                    e.preventDefault();
                    execCommand('redo');
                    break;
            }
        }
    }, [execCommand]);

    // Insert link
    const insertLink = () => {
        const url = prompt('Enter URL:');
        if (url) {
            execCommand('createLink', url);
        }
    };

    // Change font family
    const changeFontFamily = (font: string) => {
        setCurrentFont(font);
        execCommand('fontName', font);
    };

    // Change font size
    const changeFontSize = (size: string) => {
        setCurrentSize(size);
        // For font size, we need to use a different approach
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
            const span = document.createElement('span');
            span.style.fontSize = size;
            try {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(span);
                span.appendChild(range.extractContents());
                const newRange = document.createRange();
                newRange.selectNodeContents(span);
                newRange.collapse(false);
                selection.removeAllRanges();
                selection.addRange(newRange);
            } catch (e) {
                // Fallback to document.execCommand
                document.execCommand('fontSize', false, '3');
                const fontElements = editorRef.current?.querySelectorAll('font[size="3"]');
                fontElements?.forEach(el => {
                    (el as HTMLElement).style.fontSize = size;
                    el.removeAttribute('size');
                });
            }
        }
        handleInput();
    };

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Enhanced Toolbar */}
            <div className="bg-gray-50 border-b border-gray-300 p-3">
                <div className="flex flex-wrap gap-2 items-center">
                    {/* Font Family */}
                    <select
                        className="text-sm border rounded px-2 py-1 min-w-[120px]"
                        value={currentFont}
                        onChange={(e) => changeFontFamily(e.target.value)}
                    >
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Verdana">Verdana</option>
                    </select>

                    {/* Font Size */}
                    <select
                        className="text-sm border rounded px-2 py-1"
                        value={currentSize}
                        onChange={(e) => changeFontSize(e.target.value)}
                    >
                        <option value="10px">10px</option>
                        <option value="12px">12px</option>
                        <option value="14px">14px</option>
                        <option value="16px">16px</option>
                        <option value="18px">18px</option>
                        <option value="20px">20px</option>
                        <option value="24px">24px</option>
                    </select>

                    <div className="border-l border-gray-300 mx-2 h-6"></div>

                    {/* Text Formatting */}
                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('bold')}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                        title="Bold (Ctrl+B)"
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('italic')}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                        title="Italic (Ctrl+I)"
                    >
                        <Italic className="w-4 h-4" />
                    </button>
                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('underline')}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                        title="Underline (Ctrl+U)"
                    >
                        <Underline className="w-4 h-4" />
                    </button>

                    <div className="border-l border-gray-300 mx-2 h-6"></div>

                    {/* Alignment */}
                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('justifyLeft')}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                        title="Align Left"
                    >
                        <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('justifyCenter')}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                        title="Align Center"
                    >
                        <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('justifyRight')}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                        title="Align Right"
                    >
                        <AlignRight className="w-4 h-4" />
                    </button>
                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('justifyFull')}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                        title="Justify"
                    >
                        <AlignJustify className="w-4 h-4" />
                    </button>

                    <div className="border-l border-gray-300 mx-2 h-6"></div>

                    {/* Lists */}
                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('insertUnorderedList')}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                        title="Bullet List"
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('insertOrderedList')}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                        title="Numbered List"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </button>

                    <div className="border-l border-gray-300 mx-2 h-6"></div>

                    {/* Link */}
                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={insertLink}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                        title="Insert Link"
                    >
                        <Link className="w-4 h-4" />
                    </button>

                    {/* Undo/Redo */}
                    <div className="border-l border-gray-300 mx-2 h-6"></div>
                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('undo')}
                        className="p-2 hover:bg-gray-200 rounded transition-colors text-sm"
                        title="Undo (Ctrl+Z)"
                    >
                        ↶
                    </button>
                    <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execCommand('redo')}
                        className="p-2 hover:bg-gray-200 rounded transition-colors text-sm"
                        title="Redo (Ctrl+Y)"
                    >
                        ↷
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                className="min-h-[400px] p-4 focus:outline-none bg-white overflow-y-auto"
                contentEditable
                onInput={() => handleInput()}
                onKeyDown={handleKeyDown}
                dangerouslySetInnerHTML={{ __html: value }}
                style={{
                    fontFamily: currentFont,
                    lineHeight: '1.6',
                    fontSize: currentSize,
                    direction: 'ltr',
                    textAlign: 'left',
                    unicodeBidi: 'normal',
                    writingMode: 'horizontal-tb'
                }}
                data-placeholder={placeholder}
                dir="ltr"
            />

            {/* Custom CSS for placeholder and text direction */}
            <style>{`
                [contenteditable] {
                    direction: ltr !important;
                    text-align: left !important;
                    unicode-bidi: normal !important;
                    writing-mode: lr-tb !important;
                }
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                    direction: ltr;
                    text-align: left;
                }
                [contenteditable]:focus:before {
                    content: none;
                }
                [contenteditable] * {
                    direction: ltr !important;
                    text-align: inherit;
                }
            `}</style>
        </div>
    );
};

const LetterDraftingComponent = () => {
    const [letterContent, setLetterContent] = useState('');
    const [letterType, setLetterType] = useState('recommendation');
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [letterData, setLetterData] = useState({
        recipientName: '',
        recipientTitle: '',
        recipientOrganization: '',
        recipientAddress: '',
        subject: '',
        salutation: 'Dear Sir/Madam',
        closing: 'Sincerely',
        senderName: '',
        senderTitle: '',
        senderOrganization: 'University of Rwanda',
        senderEmail: '',
        senderPhone: '',
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    });

    const letterTemplates = {
        recommendation: {
            name: 'Recommendation Letter',
            template: `
        <p>I am writing to provide my highest recommendation for <strong>[Student Name]</strong>, who has been under my supervision during their academic tenure at <strong>[University/Department]</strong>.</p>
        
        <p>During the time I have known <strong>[Student Name]</strong>, they have consistently demonstrated exceptional academic performance, professional conduct, and leadership qualities that set them apart from their peers.</p>
        
        <p><strong>Academic Excellence:</strong><br/>
        [Student Name] has maintained outstanding academic performance throughout their studies, showing particular strength in [specific subjects/areas]. Their analytical thinking and problem-solving abilities are remarkable.</p>
        
        <p><strong>Professional Qualities:</strong><br/>
        Their work ethic is exemplary, consistently meeting deadlines and exceeding expectations. They demonstrate strong communication skills, both written and verbal, and work effectively in team environments.</p>
        
        <p><strong>Personal Character:</strong><br/>
        [Student Name] exhibits integrity, reliability, and a genuine commitment to learning and growth. They are respectful, courteous, and demonstrate strong moral character.</p>
        
        <p>Based on my experience with [Student Name], I am confident they will make valuable contributions to any organization or program they join. I recommend them without reservation.</p>
        
        <p>Please feel free to contact me if you require any additional information regarding this recommendation.</p>
      `
        },
        verification: {
            name: 'Verification Letter',
            template: `
        <p>This letter serves to verify that <strong>[Student Name]</strong> is/was a registered student at the University of Rwanda.</p>
        
        <p><strong>Student Details:</strong></p>
        <ul>
          <li>Full Name: [Student Full Name]</li>
          <li>Registration Number: [Registration Number]</li>
          <li>Program of Study: [Program Name]</li>
          <li>Academic Year: [Academic Year]</li>
          <li>Current Status: [Status - Active/Graduated/Discontinued]</li>
        </ul>
        
        <p><strong>Academic Performance:</strong><br/>
        [Student Name] has maintained [academic standing] throughout their studies and has successfully completed [number] credits towards their degree requirements.</p>
        
        <p>This verification is issued upon the student's request for [purpose of verification].</p>
        
        <p>Should you require any additional information or clarification, please do not hesitate to contact our office.</p>
      `
        },
        to_whom: {
            name: 'To Whom It May Concern',
            template: `
        <p>This letter is to certify that <strong>[Student Name]</strong> is a bonafide student of the University of Rwanda, currently enrolled in the <strong>[Program Name]</strong> program.</p>
        
        <p><strong>Student Information:</strong></p>
        <ul>
          <li>Student Name: [Full Name]</li>
          <li>Registration Number: [Registration Number]</li>
          <li>Faculty/School: [Faculty Name]</li>
          <li>Department: [Department Name]</li>
          <li>Year of Study: [Current Year]</li>
          <li>Expected Graduation: [Graduation Date]</li>
        </ul>
        
        <p>The student is in good academic standing and has been attending classes regularly. They have fulfilled all the requirements expected of them at this level of study.</p>
        
        <p>This letter is issued at the request of the student for <em>[purpose - scholarship application, visa application, employment, etc.]</em></p>
        
        <p>We trust this information serves your intended purpose. For any further verification or clarification, please contact our academic office.</p>
      `
        },
        denial: {
            name: 'Request Denial Letter',
            template: `
        <p>Thank you for your recent request for <strong>[type of document/service]</strong> submitted on <strong>[date]</strong>.</p>
        
        <p>After careful review of your application, we regret to inform you that we are unable to process your request at this time due to the following reason(s):</p>
        
        <ul>
          <li>[Specific reason for denial]</li>
          <li>[Additional reason if applicable]</li>
          <li>[Any other relevant factors]</li>
        </ul>
        
        <p><strong>Next Steps:</strong><br/>
        If you believe this decision was made in error or if you have additional information that might affect this decision, you may:</p>
        
        <ul>
          <li>Submit an appeal within [number] days of receiving this letter</li>
          <li>Provide additional documentation to support your request</li>
          <li>Contact our office to discuss alternative options</li>
        </ul>
        
        <p>We understand this may be disappointing, and we appreciate your understanding. Our office remains available to assist you with any questions or alternative solutions.</p>
      `
        },
        approval: {
            name: 'Request Approval Letter',
            template: `
        <p>We are pleased to inform you that your request for <strong>[type of document/service]</strong> has been approved and is being processed.</p>
        
        <p><strong>Request Details:</strong></p>
        <ul>
          <li>Request Type: [Document/Service Type]</li>
          <li>Submission Date: [Date]</li>
          <li>Reference Number: [Reference Number]</li>
          <li>Expected Completion: [Date]</li>
        </ul>
        
        <p><strong>Next Steps:</strong><br/>
        Your approved request will be processed according to our standard procedures. You can expect:</p>
        
        <ul>
          <li>Document preparation within [timeframe]</li>
          <li>Notification upon completion</li>
          <li>Collection instructions will be provided</li>
        </ul>
        
        <p><strong>Collection Information:</strong><br/>
        Once your document is ready, you will be notified via [notification method]. Please bring a valid form of identification when collecting your document.</p>
        
        <p>Thank you for your patience during the review process. If you have any questions, please contact our office.</p>
      `
        }
    };

    type LetterTemplateKey = keyof typeof letterTemplates;

    const handleTemplateSelect = (templateKey: LetterTemplateKey) => {
        setLetterType(templateKey);
        setLetterContent(letterTemplates[templateKey].template);
    };

    const generateFullLetter = () => {
        const header = `
      <div style="text-align: center; margin-bottom: 10px; border-bottom: 2px solid #1e40af; padding-bottom: 10px;display: flex; flex-direction: row;justify-content: center;gap: 50px; align-items: center;">
      <img src=${logo} alt="University of Rwanda Logo" style="width: 100px; height: auto; margin-bottom: 10px;">
      <div style="text-align: center; ">
      <h1 style="color: #1e40af; margin: 0; font-size: 24px;">UNIVERSITY OF RWANDA</h1>
        <p style="margin: 5px 0; font-size: 14px; color: #6b7280;">College of Science and Technology</p>
        <p style="margin: 0; font-size: 12px; color: #9ca3af;">P.O. Box 3900, Kigali, Rwanda | www.ur.ac.rw</p>
      </div>
        
      </div>
    `;

        const letterHead = `
      <div style="margin-bottom: 30px;">
        <div style="text-align: right; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px;">${letterData.date}</p>
        </div>
        
        ${letterData.recipientName ? `
        <div style="margin-bottom: 20px;">
          <p style="margin: 2px 0; font-weight: bold;">${letterData.recipientName}</p>
          ${letterData.recipientTitle ? `<p style="margin: 2px 0;">${letterData.recipientTitle}</p>` : ''}
          ${letterData.recipientOrganization ? `<p style="margin: 2px 0;">${letterData.recipientOrganization}</p>` : ''}
          ${letterData.recipientAddress ? `<p style="margin: 2px 0;">${letterData.recipientAddress}</p>` : ''}
        </div>
        ` : ''}
        
        ${letterData.subject ? `
        <div style="margin-bottom: 20px;">
          <p style="margin: 0; font-weight: bold;">Subject: ${letterData.subject}</p>
        </div>
        ` : ''}
        
        <p style="margin-bottom: 20px;">${letterData.salutation},</p>
      </div>
    `;

        const footer = `
      <div style="margin-top: 40px;">
        <p style="margin-bottom: 40px;">${letterData.closing},</p>
        
        <div style="margin-bottom: 10px;">
          <p style="margin: 0; font-weight: bold; border-top: 1px solid #000; width: 200px; padding-top: 5px;">
            ${letterData.senderName}
          </p>
          <p style="margin: 2px 0;">${letterData.senderTitle}</p>
          <p style="margin: 2px 0;">${letterData.senderOrganization}</p>
          ${letterData.senderEmail ? `<p style="margin: 2px 0;">Email: ${letterData.senderEmail}</p>` : ''}
          ${letterData.senderPhone ? `<p style="margin: 2px 0;">Phone: ${letterData.senderPhone}</p>` : ''}
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 10px; color: #9ca3af;">
          <p style="margin: 0;">This letter is computer generated and does not require a physical signature.</p>
        </div>
      </div>
    `;

        return header + letterHead + letterContent + footer;
    };

    const handleSave = () => {
        const letterDocument = {
            type: letterType,
            content: letterContent,
            letterData: letterData,
            fullLetter: generateFullLetter(),
            createdAt: new Date().toISOString(),
            wordCount: letterContent.replace(/<[^>]*>/g, '').split(' ').length
        };

        // Here you would typically save to your backend
        console.log('Saving letter:', letterDocument);
        alert('Letter saved successfully!');
    };

    // Toast utility (simple version)
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.className = `fixed top-6 right-6 z-[9999] px-4 py-2 rounded shadow-lg text-white text-sm transition-all duration-300 ${
            type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 2500);
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const fullLetter = generateFullLetter();

            const [{ jsPDF }, html2canvas] = await Promise.all([
                import('jspdf'),
                import('html2canvas'),
            ]);

            // Create hidden container for rendering
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'fixed';
            tempDiv.style.left = '-9999px';
            tempDiv.style.top = '0';
            tempDiv.style.width = '794px';
            tempDiv.style.padding = '20px';
            tempDiv.style.boxSizing = 'border-box';
            tempDiv.style.backgroundColor = '#ffffff';
            tempDiv.style.fontFamily = 'Times New Roman, serif';
            tempDiv.innerHTML = fullLetter;
            document.body.appendChild(tempDiv);

            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas.default(tempDiv, {
                scale: 3,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                allowTaint: true,
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4',
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 40;

            const usableWidth = pageWidth - margin * 2;
            const imgHeight = (canvas.height * usableWidth) / canvas.width;

            let position = margin;
            let heightLeft = imgHeight;

            pdf.addImage(imgData, 'JPEG', margin, position, usableWidth, imgHeight, undefined, 'MEDIUM');
            heightLeft -= (pageHeight - margin * 2);

            while (heightLeft > 0) {
                pdf.addPage();
                position = margin - (imgHeight - heightLeft);
                pdf.addImage(imgData, 'JPEG', margin, position, usableWidth, imgHeight, undefined, 'MEDIUM');
                heightLeft -= (pageHeight - margin * 2);
            }

            const letterName = `${letterType}_letter_${new Date().toISOString().split('T')[0]}.pdf`;
            const pdfBlob = pdf.output('blob');

            const formData = new FormData();
            formData.append('fileurl', pdfBlob, letterName); // ✅ correct field name
            formData.append('status', 'APPROVED');
            const id = localStorage.getItem('recomandationId');
            // ✅ PATCH with correct endpoint
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:7000/recomandation-request/recomandation/staff/${id}`, {
                method: 'PATCH',
                body: formData,
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });

            const result = await response.json();
            if (response.ok) {
                toast.success(result.message || 'PDF exported and uploaded successfully!');
            } else {
                toast.error(result.message || 'Failed to export PDF. Please try again.');
                return
            }

            pdf.save(letterName);
            document.body.removeChild(tempDiv);
            // showToast('PDF exported and uploaded successfully!', 'success');
        } catch (error) {
            console.error('Export failed:', error);
            // showToast('Failed to export PDF. Please try again.', 'error');
        } finally {
            setIsExporting(false);
        }
    };


    const handlePrint = () => {
        const fullLetter = generateFullLetter();
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Letter - ${letterType}</title>
            <style>
              body { 
                font-family: 'Times New Roman', serif; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px; 
                line-height: 1.6;
              }
              @media print { 
                body { margin: 0; padding: 15px; } 
              }
            </style>
          </head>
          <body>${fullLetter}</body>
        </html>
      `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        } else {
            alert('Unable to open print window. Please check your popup blocker settings.');
        }
    };

    // Copy content to clipboard
    const handleCopyContent = async () => {
        try {
            await navigator.clipboard.writeText(letterContent.replace(/<[^>]*>/g, ''));
            alert('Content copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy:', error);
            alert('Failed to copy content. Please try again.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto  space-y-2">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Letter Drafting System</h1>
                            <p className="text-gray-600">Create professional letters and documents</p>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => setIsPreviewMode(!isPreviewMode)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            <span>{isPreviewMode ? 'Edit' : 'Preview'}</span>
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                            <span>Print</span>
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-300 transition-colors disabled:opacity-50"
                        >
                            <Download className="w-4 h-4" />
                            <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
                        </button>
                    </div>
                </div>

                {/* Letter Templates */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-3">Letter Templates</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {Object.entries(letterTemplates).map(([key, template]) => (
                            <button
                                key={key}
                                onClick={() => handleTemplateSelect(key as LetterTemplateKey)}
                                className={`p-3 text-left border rounded-lg hover:border-blue-300 transition-colors ${letterType === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                    }`}
                            >
                                <div className="text-sm font-medium text-gray-900">{template.name}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                {/* Letter Details Form */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-semibold mb-4">Letter Details</h2>

                    <div className="space-y-4">
                        {/* Recipient Information */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                Recipient Information
                            </h3>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Recipient Name"
                                    value={letterData.recipientName}
                                    onChange={(e) => setLetterData({ ...letterData, recipientName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Title/Position"
                                    value={letterData.recipientTitle}
                                    onChange={(e) => setLetterData({ ...letterData, recipientTitle: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Organization"
                                    value={letterData.recipientOrganization}
                                    onChange={(e) => setLetterData({ ...letterData, recipientOrganization: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <textarea
                                    placeholder="Address"
                                    value={letterData.recipientAddress}
                                    onChange={(e) => setLetterData({ ...letterData, recipientAddress: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-16 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Subject and Salutation */}
                        <div>
                            <input
                                type="text"
                                placeholder="Subject Line"
                                value={letterData.subject}
                                onChange={(e) => setLetterData({ ...letterData, subject: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <select
                                value={letterData.salutation}
                                onChange={(e) => setLetterData({ ...letterData, salutation: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Dear Sir/Madam">Dear Sir/Madam</option>
                                <option value="To Whom It May Concern">To Whom It May Concern</option>
                                <option value="Dear Hiring Manager">Dear Hiring Manager</option>
                                <option value="Dear Admissions Committee">Dear Admissions Committee</option>
                            </select>
                        </div>

                        {/* Sender Information */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                                <Building className="w-4 h-4 mr-2" />
                                Sender Information
                            </h3>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={letterData.senderName}
                                    onChange={(e) => setLetterData({ ...letterData, senderName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Your Title"
                                    value={letterData.senderTitle}
                                    onChange={(e) => setLetterData({ ...letterData, senderTitle: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={letterData.senderEmail}
                                    onChange={(e) => setLetterData({ ...letterData, senderEmail: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone"
                                    value={letterData.senderPhone}
                                    onChange={(e) => setLetterData({ ...letterData, senderPhone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <select
                                    value={letterData.closing}
                                    onChange={(e) => setLetterData({ ...letterData, closing: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Sincerely">Sincerely</option>
                                    <option value="Best regards">Best regards</option>
                                    <option value="Yours faithfully">Yours faithfully</option>
                                    <option value="Respectfully">Respectfully</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editor or Preview */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">
                            {isPreviewMode ? 'Letter Preview' : 'Letter Content'}
                        </h2>
                        <div className="text-sm text-gray-500">
                            {letterContent.replace(/<[^>]*>/g, '').split(' ').filter(word => word.length > 0).length} words
                        </div>
                    </div>

                    {!isPreviewMode ? (
                        <ReactQuill
                            value={letterContent}
                            onChange={setLetterContent}
                            placeholder="Start writing your letter content here..."
                            theme="snow"
                        />
                    ) : (
                        <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 min-h-[500px] max-h-[600px] overflow-y-auto">
                            <div
                                className="prose max-w-none"
                                style={{
                                    fontFamily: 'Times New Roman, serif',
                                    lineHeight: '1.6',
                                    fontSize: '14px'
                                }}
                                dangerouslySetInnerHTML={{ __html: generateFullLetter() }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                        onClick={handleCopyContent}
                        className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">Copy Content</span>
                    </button>
                    <button className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                        <Send className="w-4 h-4" />
                        <span className="text-sm">Send Email</span>
                    </button>
                    <button
                        onClick={() => setLetterContent('')}
                        className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span className="text-sm">Clear Content</span>
                    </button>
                    <button className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Schedule</span>
                    </button>
                </div>
            </div>

            {/* Tips Section */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Editor Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                    <div>
                        <h4 className="font-medium mb-2">Keyboard Shortcuts:</h4>
                        <ul className="space-y-1">
                            <li><kbd className="px-1 bg-blue-200 rounded text-xs">Ctrl+B</kbd> - Bold text</li>
                            <li><kbd className="px-1 bg-blue-200 rounded text-xs">Ctrl+I</kbd> - Italic text</li>
                            <li><kbd className="px-1 bg-blue-200 rounded text-xs">Ctrl+U</kbd> - Underline text</li>
                            <li><kbd className="px-1 bg-blue-200 rounded text-xs">Ctrl+Z</kbd> - Undo</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">Features:</h4>
                        <ul className="space-y-1">
                            <li>• Real-time formatting with toolbar</li>
                            <li>• Font family and size selection</li>
                            <li>• Text alignment options</li>
                            <li>• List creation (ordered/unordered)</li>
                            <li>• Link insertion</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LetterDraftingComponent;