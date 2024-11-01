import {
  IconChevronRight,
  IconFileUpload,
  IconProgress,
} from "@tabler/icons-react";
import React, { useState } from "react";
import RecordDetailsHeader from "./components/RecordDetailsHeader";
import { useLocation, useNavigate } from "react-router-dom";
import FileUploadModal from "./components/FileUploadModal";
import { useUserStateContext } from "../../context/UserContext";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

const SingleRecordDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(
    state.analysisResults || "",
  );
  const [fileName, setFileName] = useState("");
  console.log(state);
  const [fileType, setFileType] = useState("");
  const { updateRecord } = useUserStateContext();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("file", file);
    setFileType(file.type);
    setFileName(file.name);
    setFile(file);
  };
  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async () => {
    setUploading(true);
    setUploadSuccess(false);

    const genAI = new GoogleGenerativeAI(geminiApiKey);

    try {
      const base64Data = await readFileAsBase64(file);

      const imageParts = [
        {
          inlineData: {
            data: base64Data,
            mimeType: fileType,
          },
        },
      ];

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `You are an expert cancer and any disease diagnosis analyst. Use your knowledge base to answer questions about giving personalized recommended treatments.
        give a detailed treatment plan for me, make it more readable, clear and easy to understand make it paragraphs to make it more readable
        `;

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();
      setAnalysisResult(text);
      // state.analysisResults = text;
      const updatedRecord = await updateRecord({
        documentID: state.id,
        analysisResults: text,
        kanbanRecords: "",
      });
      setUploadSuccess(true);
      setIsModalOpen(false); // Close the modal after a successful upload
      setFileName("");
      setFile(null);
      setFileType("");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadSuccess(false);
      setIsModalOpen(false);
    } finally {
      setUploading(false);
    }
  };

  const processTreatmentPlan = async () => {
    setIsProcessing(true);

    const genAI = new GoogleGenerativeAI(geminiApiKey);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Your role and goal is to be an that will be using this treatment plan ${analysisResult} to create Columns:
                - Todo: Tasks that need to be started
                - Doing: Tasks that are in progress
                - Done: Tasks that are completed
          
                Each task should include a brief description. The tasks should be categorized appropriately based on the stage of the treatment process.
          
                Please provide the results in the following  format for easy front-end display no quotating or what so ever just pure the structure below:

                {
                  "columns": [
                    { "id": "todo", "title": "Todo" },
                    { "id": "doing", "title": "Work in progress" },
                    { "id": "done", "title": "Done" }
                  ],
                  "tasks": [
                    { "id": "1", "columnId": "todo", "content": "Example task 1" },
                    { "id": "2", "columnId": "todo", "content": "Example task 2" },
                    { "id": "3", "columnId": "doing", "content": "Example task 3" },
                    { "id": "4", "columnId": "doing", "content": "Example task 4" },
                    { "id": "5", "columnId": "done", "content": "Example task 5" }
                  ]
                }
                            
                `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const parsedResponse = JSON.parse(text);

    console.log(text);
    console.log(parsedResponse);
    const updatedRecord = await updateRecord({
      documentID: state.id,
      kanbanRecords: text,
    });
    console.log(updatedRecord);
    navigate("/screening-schedules", { state: parsedResponse });
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-wrap gap-[26px]">
      <button
        type="button"
        onClick={handleOpenModal}
        className="mt-6 inline-flex items-center gap-x-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-[#13131a] dark:text-white dark:hover:bg-neutral-800"
      >
        <IconFileUpload />
        Upload Reports
      </button>
      {/* Upload Report Modal */}
      <FileUploadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onFileChange={handleFileChange}
        onFileUpload={handleFileUpload}
        uploading={uploading}
        uploadSuccess={uploadSuccess}
        fileName={fileName}
      />
      <RecordDetailsHeader recordName={state.recordName} />
      <div className="w-full">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="inline-block min-w-full p-1.5 align-middle">
              <div className="overflow-hidden rounded-xl border border-neutral-700 bg-[#13131a] shadow-sm">
                <div className="border-b border-neutral-700 px-6 py-4">
                  <h2 className="text-xl font-semibold text-neutral-200">
                    Personalized AI-Driven Treatment Plan
                  </h2>
                  <p className="text-sm text-neutral-400">
                    A tailored medical strategy leveraging advanced AI insights.
                  </p>
                </div>
                <div className="flex w-full flex-col px-6 py-4 text-white">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Analysis Result
                    </h2>
                    <div className="space-y-2">
                      <ReactMarkdown>{analysisResult}</ReactMarkdown>
                    </div>
                  </div>
                </div>
                {/*  */}
                <div className="mt-5 grid gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={processTreatmentPlan}
                    className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                  >
                    View Treatment Plan <IconChevronRight size={20} />
                    {isProcessing && (
                      <IconProgress
                        size={10}
                        className="mr-3 h-5 w-5 animate-spin"
                      />
                    )}
                  </button>
                </div>
              </div>
              {/*  */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleRecordDetail;
