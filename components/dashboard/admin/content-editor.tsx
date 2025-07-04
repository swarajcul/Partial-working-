"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Edit, Eye, Upload, Check, X } from "lucide-react"

interface ContentSection {
  id: string
  name: string
  type: "text" | "image" | "cta"
  content: string
  isEditing: boolean
  lastModified: string
}

export function ContentEditor() {
  const { toast } = useToast()
  const [sections, setSections] = useState<ContentSection[]>([
    {
      id: "hero-title",
      name: "Hero Title",
      type: "text",
      content: "RAPTORS ESPORTS",
      isEditing: false,
      lastModified: "2024-01-15",
    },
    {
      id: "hero-subtitle",
      name: "Hero Subtitle",
      type: "text",
      content: "Dominating the battlefield with precision, strategy, and unmatched teamwork.",
      isEditing: false,
      lastModified: "2024-01-14",
    },
    {
      id: "hero-banner",
      name: "Hero Banner",
      type: "image",
      content: "/placeholder.svg?height=600&width=1920",
      isEditing: false,
      lastModified: "2024-01-13",
    },
    {
      id: "cta-primary",
      name: "Primary CTA",
      type: "cta",
      content: "Join Our Team",
      isEditing: false,
      lastModified: "2024-01-12",
    },
    {
      id: "about-text",
      name: "About Section",
      type: "text",
      content: "Elite esports organization dedicated to competitive excellence and player development.",
      isEditing: false,
      lastModified: "2024-01-11",
    },
  ])

  const handleEdit = (id: string) => {
    setSections(sections.map((section) => (section.id === id ? { ...section, isEditing: true } : section)))
  }

  const handleSave = (id: string, newContent: string) => {
    setSections(
      sections.map((section) =>
        section.id === id
          ? {
              ...section,
              content: newContent,
              isEditing: false,
              lastModified: new Date().toISOString().split("T")[0],
            }
          : section,
      ),
    )
    toast({
      title: "Content updated",
      description: "Changes have been saved successfully.",
    })
  }

  const handleCancel = (id: string) => {
    setSections(sections.map((section) => (section.id === id ? { ...section, isEditing: false } : section)))
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white">Landing Page Content</CardTitle>
          <CardDescription className="text-gray-400">
            Edit text content, images, and CTAs for the public landing page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sections.map((section) => (
              <ContentSectionEditor
                key={section.id}
                section={section}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white">Team Information</CardTitle>
          <CardDescription className="text-gray-400">Manage team details, achievements, and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <TeamEditor />
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Eye className="w-4 h-4 mr-2" />
              Preview Changes
            </Button>
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
              <Upload className="w-4 h-4 mr-2" />
              Bulk Import
            </Button>
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface ContentSectionEditorProps {
  section: ContentSection
  onEdit: (id: string) => void
  onSave: (id: string, content: string) => void
  onCancel: (id: string) => void
}

function ContentSectionEditor({ section, onEdit, onSave, onCancel }: ContentSectionEditorProps) {
  const [editContent, setEditContent] = useState(section.content)

  const handleSave = () => {
    onSave(section.id, editContent)
  }

  const handleCancel = () => {
    setEditContent(section.content)
    onCancel(section.id)
  }

  return (
    <div className="border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-white font-medium">{section.name}</h3>
          <Badge variant="secondary" className="bg-gray-700 text-gray-300">
            {section.type}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">Modified: {section.lastModified}</span>
          {!section.isEditing && (
            <Button size="sm" variant="ghost" onClick={() => onEdit(section.id)}>
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {section.isEditing ? (
        <div className="space-y-4">
          {section.type === "text" ? (
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              rows={3}
            />
          ) : section.type === "image" ? (
            <div className="space-y-2">
              <Input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Image URL or upload new image"
              />
              <Button size="sm" variant="outline" className="border-gray-600 text-white">
                <Upload className="w-4 h-4 mr-2" />
                Upload New Image
              </Button>
            </div>
          ) : (
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
            />
          )}
          <div className="flex space-x-2">
            <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Check className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="border-gray-600 text-white">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 p-3 rounded border">
          {section.type === "image" ? (
            <div className="text-gray-400">
              <span>Image: </span>
              <span className="text-blue-400">{section.content}</span>
            </div>
          ) : (
            <p className="text-gray-300">{section.content}</p>
          )}
        </div>
      )}
    </div>
  )
}

function TeamEditor() {
  const [teams] = useState([
    { id: "rebellion", name: "Rebellion", tier: "Tier 1", winRate: "78%" },
    { id: "phoenix", name: "Phoenix", tier: "Tier 2", winRate: "65%" },
    { id: "vanguard", name: "Vanguard", tier: "Tier 1", winRate: "82%" },
  ])

  return (
    <div className="space-y-4">
      {teams.map((team) => (
        <div key={team.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div>
            <h4 className="text-white font-medium">{team.name}</h4>
            <p className="text-gray-400 text-sm">
              {team.tier} • {team.winRate} Win Rate
            </p>
          </div>
          <Button size="sm" variant="ghost" className="text-orange-500 hover:bg-orange-600/20">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      ))}
    </div>
  )
}
