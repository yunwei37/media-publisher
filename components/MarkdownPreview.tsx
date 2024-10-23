import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownPreviewProps {
  content: string
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      className="markdown-preview"
    >
      {content}
    </ReactMarkdown>
  )
}