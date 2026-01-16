"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { fr, enUS, es, de, nl } from "date-fns/locale";
import { LuCalendar as CalendarIcon } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation } from "@/store/languageStore";

const locales = {
  fr,
  en: enUS,
  es,
  de,
  nl,
};

export interface DatePickerProps {
  date?: string;
  onChange?: (date: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function DatePicker({
  date,
  onChange,
  label,
  placeholder,
  disabled,
  className,
  id,
}: DatePickerProps) {
  const { t, language } = useTranslation();
  const currentLocale = locales[language as keyof typeof locales] || fr;
  const defaultPlaceholder = t("editor.datePicker.placeholder");
  const triggerId = id ?? React.useId();
  const labelId = `${triggerId}-label`;

  // Parse the date string safely
  const selectedDate = React.useMemo(() => {
    if (!date) return undefined;
    try {
      // Try parsing YYYY-MM-DD
      if (date.length === 10) {
        return parse(date, "yyyy-MM-dd", new Date());
      }
      // Try parsing YYYY-MM
      if (date.length === 7) {
        return parse(date, "yyyy-MM", new Date());
      }
      return new Date(date);
    } catch (e) {
      return undefined;
    }
  }, [date]);

  const handleSelect = (newDate: Date | undefined) => {
    if (newDate && onChange) {
      // We store as YYYY-MM-DD to be consistent
      onChange(format(newDate, "yyyy-MM-dd"));
    }
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground" id={labelId} htmlFor={triggerId}>
          {label}
        </label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal h-10 px-3 py-2",
              !date && "text-muted-foreground"
            )}
            id={triggerId}
            aria-labelledby={label ? labelId : undefined}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "PPP", { locale: currentLocale })
            ) : (
              <span>{placeholder || defaultPlaceholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            initialFocus
            locale={currentLocale}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
