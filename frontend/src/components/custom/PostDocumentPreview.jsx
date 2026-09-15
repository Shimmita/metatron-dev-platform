import {
  ArrowBackIosNewRounded,
  ArrowForwardIosRounded,
  DownloadRounded,
  OpenInNewRounded,
  PictureAsPdfRounded,
  ZoomInRounded,
  ZoomOutRounded,
} from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export const getPostDocumentItems = (post) =>
  Array.isArray(post?.post_documents)
    ? post.post_documents.filter((document) => document?.url)
    : [];

const formatDocumentSize = (bytes = 0) => {
  if (!bytes) return "";
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const buildDocumentRoute = ({ postId, index, mode, fallbackUrl }) => {
  if (!postId) return fallbackUrl;
  return `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/document/${postId}/${index}/${mode}`;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

let pdfJsModulePromise;

const loadPdfJs = () => {
  if (!pdfJsModulePromise) {
    pdfJsModulePromise = Promise.all([
      import("pdfjs-dist"),
      import("pdfjs-dist/build/pdf.worker.entry"),
    ]).then(([pdfJs]) => pdfJs);
  }

  return pdfJsModulePromise;
};

export const PdfCanvasViewer = ({ viewUrl, fileName, isFocusedLayout = false }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const pdfRef = useRef(null);
  const renderTaskRef = useRef(null);
  const loadingTaskRef = useRef(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const target = containerRef.current;
    if (!target) return undefined;

    const updateWidth = () => {
      setContainerWidth(target.clientWidth || 0);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(target);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const loadPdf = async () => {
      setStatus("loading");
      setErrorMessage("");
      setNumPages(0);
      setPageNumber(1);

      try {
        await loadingTaskRef.current?.destroy?.();
        await pdfRef.current?.destroy?.();
      } catch (error) {
        // Ignore stale document cleanup errors from PDF.js.
      }

      pdfRef.current = null;
      const { getDocument } = await loadPdfJs();
      const loadingTask = getDocument({
        url: viewUrl,
        withCredentials: /^https?:\/\//i.test(viewUrl),
        disableRange: true,
        disableStream: true,
      });
      loadingTaskRef.current = loadingTask;

      try {
        const pdf = await loadingTask.promise;
        if (isCancelled) {
          await pdf.destroy();
          return;
        }

        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
        setStatus("rendering");
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage("Unable to render this PDF");
          setStatus("error");
        }
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
      renderTaskRef.current?.cancel?.();
      loadingTaskRef.current?.destroy?.();
      pdfRef.current?.destroy?.();
    };
  }, [viewUrl]);

  useEffect(() => {
    const pdf = pdfRef.current;
    const canvas = canvasRef.current;

    if (!pdf || !canvas || !containerWidth || !numPages) return undefined;

    let isCancelled = false;
    const renderPage = async () => {
      setStatus("rendering");
      setErrorMessage("");
      renderTaskRef.current?.cancel?.();

      try {
        const page = await pdf.getPage(pageNumber);
        if (isCancelled) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const availableWidth = Math.max(260, containerWidth - 24);
        const baseScale = availableWidth / baseViewport.width;
        const viewport = page.getViewport({ scale: baseScale * zoom });
        const outputScale = window.devicePixelRatio || 1;
        const context = canvas.getContext("2d");

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        context.setTransform(outputScale, 0, 0, outputScale, 0, 0);
        context.clearRect(0, 0, viewport.width, viewport.height);

        const renderTask = page.render({ canvasContext: context, viewport });
        renderTaskRef.current = renderTask;
        await renderTask.promise;

        if (!isCancelled) setStatus("ready");
      } catch (error) {
        if (error?.name === "RenderingCancelledException" || isCancelled) return;
        setErrorMessage("Unable to render this PDF page");
        setStatus("error");
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      renderTaskRef.current?.cancel?.();
    };
  }, [containerWidth, numPages, pageNumber, viewUrl, zoom]);

  const isBusy = status === "loading" || status === "rendering";

  return (
    <Box
      sx={{
        background: "#eef1f5",
        minHeight: isFocusedLayout ? { xs: 420, sm: 520, lg: 620 } : { xs: 340, sm: 430 },
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        sx={{
          px: 1,
          py: 0.75,
          borderBottom: "1px solid rgba(15,23,42,0.12)",
          color: "#172033",
          background: "#f8fafc",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Tooltip title="Previous page" arrow>
            <span>
              <IconButton
                size="small"
                disabled={pageNumber <= 1 || isBusy}
                onClick={() => setPageNumber((current) => clamp(current - 1, 1, numPages || 1))}
              >
                <ArrowBackIosNewRounded sx={{ width: 15, height: 15 }} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Next page" arrow>
            <span>
              <IconButton
                size="small"
                disabled={pageNumber >= numPages || isBusy}
                onClick={() => setPageNumber((current) => clamp(current + 1, 1, numPages || 1))}
              >
                <ArrowForwardIosRounded sx={{ width: 15, height: 15 }} />
              </IconButton>
            </span>
          </Tooltip>
          <Typography variant="caption" fontWeight={900}>
            Page {pageNumber}{numPages ? ` of ${numPages}` : ""}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Tooltip title="Zoom out" arrow>
            <span>
              <IconButton
                size="small"
                disabled={zoom <= 0.75 || isBusy}
                onClick={() => setZoom((current) => clamp(Number((current - 0.15).toFixed(2)), 0.75, 1.6))}
              >
                <ZoomOutRounded sx={{ width: 17, height: 17 }} />
              </IconButton>
            </span>
          </Tooltip>
          <Typography variant="caption" fontWeight={900} sx={{ minWidth: 42, textAlign: "center" }}>
            {Math.round(zoom * 100)}%
          </Typography>
          <Tooltip title="Zoom in" arrow>
            <span>
              <IconButton
                size="small"
                disabled={zoom >= 1.6 || isBusy}
                onClick={() => setZoom((current) => clamp(Number((current + 0.15).toFixed(2)), 0.75, 1.6))}
              >
                <ZoomInRounded sx={{ width: 17, height: 17 }} />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Box>

      <Box
        ref={containerRef}
        sx={{
          position: "relative",
          height: isFocusedLayout ? { xs: 380, sm: 480, lg: 580 } : { xs: 300, sm: 390 },
          overflow: "auto",
          overscrollBehavior: "contain",
          p: 1.5,
          display: "flex",
          justifyContent: "center",
          alignItems: status === "ready" ? "flex-start" : "center",
          "&::-webkit-scrollbar": { width: 8, height: 8 },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(71,85,105,0.36)",
            borderRadius: 999,
          },
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(71,85,105,0.36) transparent",
        }}
      >
        {isBusy && (
          <Stack alignItems="center" spacing={1} sx={{ color: "#334155" }}>
            <CircularProgress size={22} />
            <Typography variant="caption" fontWeight={800}>
              Rendering PDF
            </Typography>
          </Stack>
        )}

        {errorMessage && (
          <Stack alignItems="center" spacing={0.75} sx={{ color: "#334155", textAlign: "center", px: 2 }}>
            <PictureAsPdfRounded color="primary" sx={{ width: 28, height: 28 }} />
            <Typography variant="caption" fontWeight={900}>
              {errorMessage}
            </Typography>
            <Typography variant="caption">{fileName}</Typography>
          </Stack>
        )}

        <Box
          component="canvas"
          ref={canvasRef}
          sx={{
            display: status === "error" ? "none" : "block",
            boxShadow: "0 12px 34px rgba(15,23,42,0.18)",
            background: "#fff",
            maxWidth: "none",
          }}
        />
      </Box>
    </Box>
  );
};

const PostDocumentPreview = ({ documents = [], postId, isFocusedLayout = false }) => {
  const visibleDocuments = documents.filter((document) => document?.url);

  if (!visibleDocuments.length) return null;

  return (
    <Stack px={{ xs: 1.25, sm: 2 }} pb={isFocusedLayout ? 1.5 : 2} spacing={1.2}>
      {visibleDocuments.map((document) => {
        const fileName = document.name || "Technical document.pdf";
        const sizeLabel = formatDocumentSize(document.size);
        const documentIndex = documents.indexOf(document);
        const viewUrl = buildDocumentRoute({
          postId,
          index: documentIndex,
          mode: "view",
          fallbackUrl: document.url,
        });
        const downloadUrl = buildDocumentRoute({
          postId,
          index: documentIndex,
          mode: "download",
          fallbackUrl: document.url,
        });

        return (
          <Box
            key={document.publicId || document.url}
            sx={{
              borderRadius: "8px",
              border: "1px solid rgba(214,178,94,0.18)",
              background: "rgba(255,255,255,0.035)",
              overflow: "hidden",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              flexDirection={{ xs: "column", sm: "row" }}
              gap={1}
              sx={{
                p: { xs: 1, sm: 1.15 },
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                background: "linear-gradient(135deg, rgba(214,178,94,0.12), rgba(255,255,255,0.035))",
              }}
            >
              <Box display="flex" alignItems="center" gap={1} minWidth={0} width="100%">
                <PictureAsPdfRounded color="primary" sx={{ width: 22, height: 22, flexShrink: 0 }} />
                <Box minWidth={0}>
                  <Typography variant="body2" fontWeight={900} noWrap>
                    {fileName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PDF document{sizeLabel ? ` - ${sizeLabel}` : ""}
                  </Typography>
                </Box>
              </Box>

              <Stack direction="row" spacing={0.75} flexShrink={0}>
                <Tooltip title="Open PDF" arrow>
                  <Button
                    component="a"
                    href={viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    variant="text"
                    startIcon={<OpenInNewRounded sx={{ width: 16, height: 16 }} />}
                    onClick={(event) => event.stopPropagation()}
                    sx={{ minWidth: 0, px: 1.1 }}
                  >
                    Open
                  </Button>
                </Tooltip>
                <Tooltip title="Download PDF" arrow>
                  <Button
                    component="a"
                    href={downloadUrl}
                    download={fileName}
                    size="small"
                    variant="text"
                    startIcon={<DownloadRounded sx={{ width: 16, height: 16 }} />}
                    onClick={(event) => event.stopPropagation()}
                    sx={{ minWidth: 0, px: 1.1 }}
                  >
                    Download
                  </Button>
                </Tooltip>
              </Stack>
            </Box>

            <PdfCanvasViewer
              viewUrl={viewUrl}
              fileName={fileName}
              isFocusedLayout={isFocusedLayout}
            />
          </Box>
        );
      })}
    </Stack>
  );
};

export default PostDocumentPreview;
