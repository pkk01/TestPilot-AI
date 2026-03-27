'use client';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { 
    FlaskConical, 
    GitBranch, 
    Play, 
    FileArchive, 
    Activity, 
    Settings, 
    User, 
    LayoutDashboard, 
    Sparkles 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    
    // Add custom event listener for click triggers
    const triggerPalette = () => setOpen((open) => !open);
    window.addEventListener('toggle-command-palette', triggerPalette);

    return () => {
        document.removeEventListener("keydown", down);
        window.removeEventListener('toggle-command-palette', triggerPalette);
    };
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

    return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={`Type a command or search...`} />
      <CommandList className="max-h-[60vh] overflow-y-auto">
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="TestPilot AI Suggestions" className="text-primary font-medium">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/generate?requirement=Checkout+Flow+Playwright'))}
            className="cursor-pointer"
          >
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            <span>Generate Playwright script for Checkout</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/generate?requirement=JIRA-409+Gherkin'))}
            className="cursor-pointer"
          >
            <GitBranch className="mr-2 h-4 w-4 text-cyan-400" />
            <span>Create Gherkin scenarios for JIRA-409</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => console.log('Running regression suite'))}
            className="cursor-pointer"
          >
            <Play className="mr-2 h-4 w-4 text-green-500" />
            <span>Run nightly regression suite</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runCommand(() => router.push('/generate'))} className="cursor-pointer">
            <FlaskConical className="mr-2 h-4 w-4" />
            <span>New Test Generation</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => console.log('Exporting'))} className="cursor-pointer">
            <FileArchive className="mr-2 h-4 w-4" />
            <span>Export test artifacts to Selenium ZIP</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => console.log('Analyzing Failure'))} className="cursor-pointer">
            <Activity className="mr-2 h-4 w-4 text-red-400" />
            <span>Analyze test failure in Payment Module</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))} className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Go to Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/profile'))} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Go to Profile</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/profile'))} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
