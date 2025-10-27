import { Highlight, themes } from 'prism-react-renderer'
import Box from '@mui/material/Box'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language: string
  filename?: string
}

export default function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Box sx={{ position: 'relative', my: 6, borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: '#3d3d3d', bgcolor: '#1e1e1e' }}>
      {filename && (
        <Box sx={{ bgcolor: '#2d2d2d', px: 2, py: 1, fontSize: '0.875rem', color: '#d4d4d4', borderBottom: '1px solid', borderColor: '#3d3d3d', fontFamily: 'monospace' }}>
          {filename}
        </Box>
      )}
      <Box sx={{ position: 'relative' }}>
        <Box
          component="button"
          onClick={handleCopy}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            p: 1,
            borderRadius: 1,
            bgcolor: '#2d2d2d',
            color: '#d4d4d4',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            '&:hover': {
              bgcolor: '#3d3d3d'
            }
          }}
          title="Copy code"
        >
          {copied ? <CheckIcon sx={{ fontSize: 16 }} /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
        </Box>
        <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <Box component="pre" className={className} sx={{ p: 2, overflowX: 'auto', fontSize: '0.875rem' }} style={style}>
              {tokens.map((line, i) => (
                <Box key={i} component="div" {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </Box>
              ))}
            </Box>
          )}
        </Highlight>
      </Box>
    </Box>
  )
}
