import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MLInput({def,slug,searchParams}){

  return (
    <div className="mb-4">
      <Label className="mb-1 block">
        {def.name}:{def.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {['string', 'number', 'date'].includes(def.type) && (
        <Input
          size="sm"
          name={slug}
          placeholder={def.placeholder}
          defaultValue={searchParams[slug] || def.default || ""}
          type={def.type === 'string' ? 'text' : def.type}
          required={def.required}
        />
      )}
      {def.type === 'file' && (
        <Input
          size="sm"
          name={slug}
          placeholder={def.placeholder}
          type="file"
          required={def.required}
        />
      )}
      {def.type === 'dropdown' && (
        <Select
          name={slug}
          defaultValue={searchParams[slug] || def.default || ""}
          required={def.required}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder={def.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {def.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label || option.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}