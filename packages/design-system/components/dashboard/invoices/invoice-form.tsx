import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { UserCheck } from 'lucide-react'
import { useState } from 'react'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { Button } from '@remio/design-system/components/ui/button'
import Spinner from '@remio/design-system/components/misc/spinner'
import { FormContext } from '@remio/design-system/components/form/form-context'
import { useRouter } from 'next/navigation'
import { Client, Invoice } from '@remio/database'
import { InvoiceFormData, invoiceValidationSchema } from './invoice-schema'
import { updateInvoice } from '@remio/design-system/actions/invoices/update-invoice'
import { addInvoice } from '@remio/design-system/actions/invoices/add-invoice'
import { deleteInvoice } from '@remio/design-system/actions/invoices/delete-invoice'
import TextareaInput from '@remio/design-system/components/form/input/textarea-input'
import DatePicker from '@remio/design-system/components/form/date/date-time-picker'
import ClientSelect from '@remio/design-system/components/form/clients/client-select'
import MoneyInput from '@remio/design-system/components/form/money/money-input'
import { nearestDateValue } from '@remio/design-system/lib/utils/nearest-date-value'
import { cn } from '@remio/design-system/lib/utils'

export default function InvoiceForm({
  invoice,
  client,
  setIsOpen,
  onSuccess,
  onDelete,
  className,
}: {
  invoice?: Invoice
  client?: Client
  setIsOpen?: (isOpen: boolean) => void
  onSuccess?: () => void
  onDelete?: () => void
  className?: string
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [attemptSubmitted, setAttemptSubmitted] = useState<boolean>(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    client || null
  )
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      clientId: client?.id || '',
      amount: invoice?.amount || 0,
      dueDate: invoice?.dueDate || nearestDateValue(new Date()),
      reference: invoice?.reference || '',
    } as InvoiceFormData,
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      setAttemptSubmitted(true)
      const success = invoice
        ? await updateInvoice(value, invoice.id)
        : await addInvoice(value)
      if (!success) {
        toast.error('Something went wrong.', {
          description: 'Please try again later.',
        })
      } else {
        toast.success(
          invoice
            ? 'Invoice updated successfully.'
            : 'Invoice added successfully.',
          {
            description: 'You can now create invoices, payments and more.',
            icon: <UserCheck />,
          }
        )
        router.refresh()
        onSuccess?.()
      }
      setIsLoading(false)
      setIsOpen?.(false)
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: invoiceValidationSchema,
    },
  })
  return (
    <FormContext.Provider value={{ attemptSubmitted }}>
      <form className={cn(className, 'flex flex-col w-full gap-4 mx-auto')}>
        <div className="grid grid-cols-2 gap-4">
          <ClientSelect
            form={form}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            className="col-span-2"
          />
          <MoneyInput
            form={form}
            name="amount"
            label="Amount"
            placeholder="Amount"
            required
            currency="EUR"
          />
          <DatePicker
            form={form}
            name="dueDate"
            label="Due Date"
            placeholder="Due Date"
            required
          />
          <TextareaInput
            form={form}
            name="reference"
            label="Reference"
            placeholder="Reference"
            className="col-span-2"
          />
        </div>
        <div className="flex gap-2">
          {invoice && (
            <Button
              className="font-heading w-full font-bold"
              disabled={isDeleting}
              colors="destructive"
              onClick={async () => {
                setIsDeleting(true)
                const success = await deleteInvoice(invoice.id)
                if (success) {
                  toast.success('Invoice deleted successfully.', {
                    description: 'You can always add them back later.',
                  })
                  router.refresh()
                  if (setIsOpen) setIsOpen(false)
                } else {
                  toast.error('Something went wrong.', {
                    description: 'Please try again later.',
                  })
                }
                setIsDeleting(false)
                onDelete?.()
              }}
            >
              {isDeleting ? <Spinner /> : 'Delete Invoice'}
            </Button>
          )}
          <Button
            className="w-full"
            disabled={isLoading}
            variant="shine"
            colors="none"
            onClick={(e) => {
              setAttemptSubmitted(true)
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            {isLoading ? (
              <Spinner />
            ) : invoice ? (
              'Update Invoice'
            ) : (
              'Add Invoice'
            )}
          </Button>
        </div>
      </form>
    </FormContext.Provider>
  )
}
