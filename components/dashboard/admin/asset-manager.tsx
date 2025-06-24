"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Upload, Trash2, Download, Eye, AlertCircle } from "lucide-react"
import NextImage from "next/image"

interface Asset {
  id: string
  name: string
  type: "logo" | "hero-banner" | "team-icon" | "section-image" | "footer-logo" | "scrim-logo"
  url: string
  size: string
  dimensions: string
  uploadDate: string
  isValid: boolean
}

const assetRequirements = {
  logo: { width: 300, height: 80, description: "Main logo for header" },
  "hero-banner": { width: 1920, height: 600, description: "Hero section background" },
  "team-icon": { width: 128, height: 128, description: "Team profile icons" },
  "section-image": { width: 600, height: 400, description: "General section images" },
  "footer-logo": { width: 180, height: 60, description: "Footer logo" },
  "scrim-logo": { width: 160, height: 80, description: "Scrim partner logos" },
}

export function AssetManager() {
  const { toast } = useToast()
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "1",
      name: "main-logo.png",
      type: "logo",
      url: "/placeholder.svg?height=80&width=300",
      size: "45 KB",
      dimensions: "300×80",
      uploadDate: "2024-01-15",
      isValid: true,
    },
    {
      id: "2",
      name: "hero-background.jpg",
      type: "hero-banner",
      url: "/placeholder.svg?height=600&width=1920",
      size: "2.1 MB",
      dimensions: "1920×600",
      uploadDate: "2024-01-14",
      isValid: true,
    },
    {
      id: "3",
      name: "rebellion-icon.png",
      type: "team-icon",
      url: "/placeholder.svg?height=128&width=128",
      size: "32 KB",
      dimensions: "128×128",
      uploadDate: "2024-01-13",
      isValid: true,
    },
    {
      id: "4",
      name: "old-banner.jpg",
      type: "hero-banner",
      url: "/placeholder.svg?height=400&width=1200",
      size: "1.8 MB",
      dimensions: "1200×400",
      uploadDate: "2024-01-10",
      isValid: false,
    },
  ])

  const [selectedType, setSelectedType] = useState<string>("all")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const filteredAssets = assets.filter((asset) => selectedType === "all" || asset.type === selectedType)

  const handleFileUpload = async (file: File, type: string) => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)

          // Add new asset
          const newAsset: Asset = {
            id: Date.now().toString(),
            name: file.name,
            type: type as any,
            url: URL.createObjectURL(file),
            size: `${(file.size / 1024).toFixed(0)} KB`,
            dimensions: "Unknown", // Would be determined after upload
            uploadDate: new Date().toISOString().split("T")[0],
            isValid: true,
          }

          setAssets((prev) => [...prev, newAsset])
          toast({
            title: "Upload successful",
            description: `${file.name} has been uploaded successfully.`,
          })

          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleDelete = (assetId: string) => {
    setAssets(assets.filter((asset) => asset.id !== assetId))
    toast({
      title: "Asset deleted",
      description: "Asset has been removed successfully.",
    })
  }

  const getTypeColor = (type: string) => {
    const colors = {
      logo: "bg-blue-600",
      "hero-banner": "bg-purple-600",
      "team-icon": "bg-green-600",
      "section-image": "bg-yellow-600",
      "footer-logo": "bg-indigo-600",
      "scrim-logo": "bg-pink-600",
    }
    return colors[type as keyof typeof colors] || "bg-gray-600"
  }

  return (
    <div className="space-y-6">
      {/* Asset Requirements */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white">Asset Requirements</CardTitle>
          <CardDescription className="text-gray-400">Required dimensions for different asset types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(assetRequirements).map(([type, req]) => (
              <div key={type} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`${getTypeColor(type)} text-white capitalize`}>{type.replace("-", " ")}</Badge>
                  <span className="text-white font-mono text-sm">
                    {req.width}×{req.height}px
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{req.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <CardTitle className="text-white">Upload Assets</CardTitle>
          <CardDescription className="text-gray-400">Upload images for your landing page and platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Asset Type</Label>
                <select
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">Select asset type</option>
                  {Object.keys(assetRequirements).map((type) => (
                    <option key={type} value={type}>
                      {type.replace("-", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">File</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file && selectedType) {
                      handleFileUpload(file, selectedType)
                    }
                  }}
                  className="bg-gray-800 border-gray-600 text-white"
                  disabled={isUploading || !selectedType}
                />
              </div>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Uploading...</span>
                  <span className="text-white">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <div className="flex space-x-2">
              <Button className="bg-orange-600 hover:bg-orange-700" disabled={isUploading}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Asset
              </Button>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                Bulk Upload
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Library */}
      <Card className="bg-gray-900 border-orange-600/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Asset Library</CardTitle>
              <CardDescription className="text-gray-400">Manage your uploaded assets</CardDescription>
            </div>
            <div className="flex space-x-2">
              <select
                className="p-2 bg-gray-800 border border-gray-600 rounded text-white"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">All Types</option>
                {Object.keys(assetRequirements).map((type) => (
                  <option key={type} value={type}>
                    {type.replace("-", " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="aspect-video relative bg-gray-700 flex items-center justify-center">
                  <NextImage
                    src={asset.url || "/placeholder.svg"}
                    alt={asset.name}
                    width={200}
                    height={120}
                    className="max-w-full max-h-full object-contain"
                  />
                  {!asset.isValid && (
                    <div className="absolute top-2 right-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`${getTypeColor(asset.type)} text-white text-xs`}>
                      {asset.type.replace("-", " ")}
                    </Badge>
                    {!asset.isValid && (
                      <Badge variant="destructive" className="text-xs">
                        Invalid Size
                      </Badge>
                    )}
                  </div>
                  <h4 className="text-white font-medium truncate mb-1">{asset.name}</h4>
                  <div className="text-gray-400 text-sm space-y-1">
                    <div>Size: {asset.size}</div>
                    <div>Dimensions: {asset.dimensions}</div>
                    <div>Uploaded: {asset.uploadDate}</div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-600/20">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-green-400 hover:bg-green-600/20">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(asset.id)}
                      className="text-red-400 hover:bg-red-600/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
