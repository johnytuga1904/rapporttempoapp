import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Pencil, Trash2, AlertCircle } from "lucide-react";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

interface WorkEntry {
  id: string;
  date: string;
  name: string;
  orderNumber: string;
  location: string;
  objects: string;
  regularHours: number;
  overtimeHours: number;
  absenceHours: number;
}

interface ReportTableProps {
  entries: WorkEntry[];
  onEdit: (entry: WorkEntry) => void;
  onDelete: (id: string) => void;
}

const ReportTable: React.FC<ReportTableProps> = ({
  entries = [
    {
      id: "1",
      date: "2023-06-15",
      name: "Max Mustermann",
      orderNumber: "ZH-2023-001",
      location: "Zürich",
      objects: "Hauptgebäude, Garage",
      regularHours: 8,
      overtimeHours: 1.5,
      absenceHours: 0,
    },
    {
      id: "2",
      date: "2023-06-16",
      name: "Max Mustermann",
      orderNumber: "ZH-2023-001",
      location: "Winterthur",
      objects: "Lagerhaus",
      regularHours: 7.5,
      overtimeHours: 0,
      absenceHours: 0.5,
    },
  ],
  onEdit = () => {},
  onDelete = () => {},
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<WorkEntry | null>(null);
  const [editedEntry, setEditedEntry] = useState<WorkEntry | null>(null);

  const handleEditClick = (entry: WorkEntry) => {
    setCurrentEntry(entry);
    setEditedEntry({ ...entry });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (entry: WorkEntry) => {
    setCurrentEntry(entry);
    setDeleteDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editedEntry) {
      onEdit(editedEntry);
      setEditDialogOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (currentEntry) {
      onDelete(currentEntry.id);
      setDeleteDialogOpen(false);
    }
  };

  const handleInputChange = (
    field: keyof WorkEntry,
    value: string | number,
  ) => {
    if (editedEntry) {
      setEditedEntry({
        ...editedEntry,
        [field]: value,
      });
    }
  };

  // Calculate totals
  const totalRegularHours = entries.reduce(
    (sum, entry) => sum + entry.regularHours,
    0,
  );
  const totalOvertimeHours = entries.reduce(
    (sum, entry) => sum + entry.overtimeHours,
    0,
  );
  const totalAbsenceHours = entries.reduce(
    (sum, entry) => sum + entry.absenceHours,
    0,
  );
  const totalHours = totalRegularHours + totalOvertimeHours - totalAbsenceHours;

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-gray-100">
        Arbeitsrapport Einträge
      </h2>

      <ScrollArea className="h-[300px] sm:h-[400px] w-full rounded-md border">
        <Table>
          <TableCaption>Aktuelle Arbeitsrapport Einträge</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Datum</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Auftragsnr.</TableHead>
              <TableHead>Ort</TableHead>
              <TableHead>Objekte</TableHead>
              <TableHead className="text-right">Std.</TableHead>
              <TableHead className="text-right">Überstd.</TableHead>
              <TableHead className="text-right">Absenz</TableHead>
              <TableHead className="text-center">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <p>Keine Einträge vorhanden</p>
                    <p className="text-sm">
                      Fügen Sie neue Einträge über das Formular hinzu
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {new Date(entry.date).toLocaleDateString("de-CH")}
                  </TableCell>
                  <TableCell>{entry.name}</TableCell>
                  <TableCell>{entry.orderNumber}</TableCell>
                  <TableCell>{entry.location}</TableCell>
                  <TableCell>{entry.objects}</TableCell>
                  <TableCell className="text-right">
                    {entry.regularHours.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.overtimeHours.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.absenceHours.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClick(entry)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500"
                        onClick={() => handleDeleteClick(entry)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
            {entries.length > 0 && (
              <TableRow className="font-bold bg-gray-100 dark:bg-gray-700">
                <TableCell colSpan={5} className="text-right">
                  Summe:
                </TableCell>
                <TableCell className="text-right">
                  {totalRegularHours.toFixed(1)}
                </TableCell>
                <TableCell className="text-right">
                  {totalOvertimeHours.toFixed(1)}
                </TableCell>
                <TableCell className="text-right">
                  {totalAbsenceHours.toFixed(1)}
                </TableCell>
                <TableCell className="text-right">
                  Total: {totalHours.toFixed(1)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eintrag bearbeiten</DialogTitle>
          </DialogHeader>
          {editedEntry && (
            <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <label htmlFor="edit-date" className="text-right">
                  Datum:
                </label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editedEntry.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-name" className="text-right">
                  Name:
                </label>
                <Input
                  id="edit-name"
                  value={editedEntry.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-order" className="text-right">
                  Auftragsnr.:
                </label>
                <Input
                  id="edit-order"
                  value={editedEntry.orderNumber}
                  onChange={(e) =>
                    handleInputChange("orderNumber", e.target.value)
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-location" className="text-right">
                  Ort:
                </label>
                <Input
                  id="edit-location"
                  value={editedEntry.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-objects" className="text-right">
                  Objekte:
                </label>
                <Input
                  id="edit-objects"
                  value={editedEntry.objects}
                  onChange={(e) => handleInputChange("objects", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-hours" className="text-right">
                  Stunden:
                </label>
                <Input
                  id="edit-hours"
                  type="number"
                  step="0.5"
                  value={editedEntry.regularHours}
                  onChange={(e) =>
                    handleInputChange(
                      "regularHours",
                      parseFloat(e.target.value),
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-overtime" className="text-right">
                  Überstunden:
                </label>
                <Input
                  id="edit-overtime"
                  type="number"
                  step="0.5"
                  value={editedEntry.overtimeHours}
                  onChange={(e) =>
                    handleInputChange(
                      "overtimeHours",
                      parseFloat(e.target.value),
                    )
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-absence" className="text-right">
                  Absenz:
                </label>
                <Input
                  id="edit-absence"
                  type="number"
                  step="0.5"
                  value={editedEntry.absenceHours}
                  onChange={(e) =>
                    handleInputChange(
                      "absenceHours",
                      parseFloat(e.target.value),
                    )
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSaveEdit}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eintrag löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie diesen Eintrag löschen möchten? Diese
              Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReportTable;
