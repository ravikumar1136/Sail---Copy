"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

// Define the order form data structure
interface OrderFormData {
  grade: string
  thickness: string
  width: string
  length: string
  finish: string
  quality: string
  edge: string
  bQuantity: string
  customer: string
  sspRoId: string
  releaseDate: string
  requiredQuantity: string
  mou: string
  remarks: string
  ssDivisionBso: string
  shippingCode: string
  billingCode: string
  customerAddress: string
  dispatchTo: string
  marketingRemarks: string
  zmillRemarks: string
  cblSaleableRemarks: string
  slittingRemarks: string
  shearingRemarks: string
}

export default function OrderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with default values
  const [formData, setFormData] = useState<OrderFormData>({
    grade: "",
    thickness: "",
    width: "",
    length: "",
    finish: "",
    quality: "",
    edge: "",
    bQuantity: "",
    customer: "",
    sspRoId: "",
    releaseDate: new Date().toISOString().split("T")[0],
    requiredQuantity: "",
    mou: "",
    remarks: "",
    ssDivisionBso: "",
    shippingCode: "",
    billingCode: "",
    customerAddress: "",
    dispatchTo: "",
    marketingRemarks: "",
    zmillRemarks: "",
    cblSaleableRemarks: "",
    slittingRemarks: "",
    shearingRemarks: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order")
      }

      toast({
        title: "Order created successfully",
        description: "Your order has been submitted.",
      })

      // Redirect to confirmation page
      router.push(`/order/confirmation?id=${data.orderId}`)
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create order",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Place Steel Order</CardTitle>
          <CardDescription>Fill out the form below to place your steel order with SAIL.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Grade */}
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Select onValueChange={(value) => handleSelectChange("grade", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="201">201</SelectItem>
                    <SelectItem value="201LN">201LN</SelectItem>
                    <SelectItem value="204CU">204CU</SelectItem>
                    <SelectItem value="304">304</SelectItem>
                    <SelectItem value="316">316</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Thickness */}
              <div className="space-y-2">
                <Label htmlFor="thickness">Thickness (mm)</Label>
                <Input
                  id="thickness"
                  name="thickness"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 1.5"
                  required
                  value={formData.thickness}
                  onChange={handleChange}
                />
              </div>

              {/* Width */}
              <div className="space-y-2">
                <Label htmlFor="width">Width (mm)</Label>
                <Input
                  id="width"
                  name="width"
                  type="number"
                  placeholder="e.g., 1250"
                  required
                  value={formData.width}
                  onChange={handleChange}
                />
              </div>

              {/* Length */}
              <div className="space-y-2">
                <Label htmlFor="length">Length (mm)</Label>
                <Input
                  id="length"
                  name="length"
                  type="number"
                  placeholder="e.g., 2500"
                  value={formData.length}
                  onChange={handleChange}
                />
              </div>

              {/* Finish */}
              <div className="space-y-2">
                <Label htmlFor="finish">Finish</Label>
                <Select onValueChange={(value) => handleSelectChange("finish", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select finish" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2B">2B</SelectItem>
                    <SelectItem value="2D">2D</SelectItem>
                    <SelectItem value="NO1">NO1</SelectItem>
                    <SelectItem value="BA">BA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quality */}
              <div className="space-y-2">
                <Label htmlFor="quality">Quality</Label>
                <Select onValueChange={(value) => handleSelectChange("quality", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P">P</SelectItem>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Edge */}
              <div className="space-y-2">
                <Label htmlFor="edge">Edge</Label>
                <Select onValueChange={(value) => handleSelectChange("edge", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select edge" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="T">T</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* B Quantity */}
              <div className="space-y-2">
                <Label htmlFor="bQuantity">B Quantity</Label>
                <Input
                  id="bQuantity"
                  name="bQuantity"
                  type="number"
                  step="0.001"
                  placeholder="e.g., 2.5"
                  required
                  value={formData.bQuantity}
                  onChange={handleChange}
                />
              </div>

              {/* SS Division BSO */}
              <div className="space-y-2">
                <Label htmlFor="ssDivisionBso">SS Division BSO</Label>
                <Input
                  id="ssDivisionBso"
                  name="ssDivisionBso"
                  type="text"
                  placeholder="Enter SS Division BSO"
                  value={formData.ssDivisionBso}
                  onChange={handleChange}
                />
              </div>

              {/* Shipping Code */}
              <div className="space-y-2">
                <Label htmlFor="shippingCode">Shipping Code</Label>
                <Input
                  id="shippingCode"
                  name="shippingCode"
                  type="text"
                  placeholder="Enter shipping code"
                  value={formData.shippingCode}
                  onChange={handleChange}
                />
              </div>

              {/* Billing Code */}
              <div className="space-y-2">
                <Label htmlFor="billingCode">Billing Code</Label>
                <Input
                  id="billingCode"
                  name="billingCode"
                  type="text"
                  placeholder="Enter billing code"
                  value={formData.billingCode}
                  onChange={handleChange}
                />
              </div>

              {/* Customer Address */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="customerAddress">Customer Address</Label>
                <Textarea
                  id="customerAddress"
                  name="customerAddress"
                  placeholder="Enter customer address"
                  value={formData.customerAddress}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              {/* Dispatch To */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="dispatchTo">Dispatch To</Label>
                <Textarea
                  id="dispatchTo"
                  name="dispatchTo"
                  placeholder="Enter dispatch details"
                  value={formData.dispatchTo}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              {/* Marketing Remarks */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="marketingRemarks">Marketing Remarks</Label>
                <Textarea
                  id="marketingRemarks"
                  name="marketingRemarks"
                  placeholder="Enter marketing remarks"
                  value={formData.marketingRemarks}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              {/* Zmill Remarks */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="zmillRemarks">Zmill Remarks</Label>
                <Textarea
                  id="zmillRemarks"
                  name="zmillRemarks"
                  placeholder="Enter Zmill remarks"
                  value={formData.zmillRemarks}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              {/* CBL Saleable Remarks */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cblSaleableRemarks">CBL Saleable Remarks</Label>
                <Textarea
                  id="cblSaleableRemarks"
                  name="cblSaleableRemarks"
                  placeholder="Enter CBL saleable remarks"
                  value={formData.cblSaleableRemarks}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              {/* Slitting Remarks */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="slittingRemarks">Slitting Remarks</Label>
                <Textarea
                  id="slittingRemarks"
                  name="slittingRemarks"
                  placeholder="Enter slitting remarks"
                  value={formData.slittingRemarks}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              {/* Shearing Remarks */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="shearingRemarks">Shearing Remarks</Label>
                <Textarea
                  id="shearingRemarks"
                  name="shearingRemarks"
                  placeholder="Enter shearing remarks"
                  value={formData.shearingRemarks}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              {/* Customer */}
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Input
                  id="customer"
                  name="customer"
                  placeholder="Customer name"
                  required
                  value={formData.customer}
                  onChange={handleChange}
                />
              </div>

              {/* SSP RO ID */}
              <div className="space-y-2">
                <Label htmlFor="sspRoId">SSP RO ID</Label>
                <Input
                  id="sspRoId"
                  name="sspRoId"
                  placeholder="e.g., 123456"
                  required
                  value={formData.sspRoId}
                  onChange={handleChange}
                />
              </div>

              {/* Release Date */}
              <div className="space-y-2">
                <Label htmlFor="releaseDate">Release Date</Label>
                <Input
                  id="releaseDate"
                  name="releaseDate"
                  type="date"
                  required
                  value={formData.releaseDate}
                  onChange={handleChange}
                />
              </div>

              {/* Required Quantity */}
              <div className="space-y-2">
                <Label htmlFor="requiredQuantity">Required Quantity</Label>
                <Input
                  id="requiredQuantity"
                  name="requiredQuantity"
                  type="number"
                  step="0.001"
                  placeholder="e.g., 10"
                  required
                  value={formData.requiredQuantity}
                  onChange={handleChange}
                />
              </div>

              {/* MOU */}
              <div className="space-y-2">
                <Label htmlFor="mou">MOU</Label>
                <Input
                  id="mou"
                  name="mou"
                  placeholder="MOU details"
                  required
                  value={formData.mou}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                name="remarks"
                placeholder="Additional information or special requirements"
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Submit Order"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

