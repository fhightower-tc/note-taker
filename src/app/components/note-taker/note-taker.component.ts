import { Component, OnInit } from '@angular/core';

import { DatastoreService } from '../../services/datastore.service';

declare var $:any

@Component({
  selector: 'note-taker',
  templateUrl: './note-taker.component.html',
  styleUrls: ['./note-taker.component.less']
})
export class NoteTakerComponent implements OnInit {
  public noteText: string = '';
  public noteId: string = '';
  public cleared: boolean = false;
  private clearedNoteText: string = '';

  constructor(public datastore: DatastoreService) {}

  ngOnInit() {
    this.datastore.getNotes('');
    $(document).foundation();
    this.focus();
  }

  private focus() {
    /* Focus on the text area. */
    $('#noteInput').focus();
  }

  private reset() {
    this.noteText = '';
    this.noteId = '';
    this.focus();
    this.datastore.saved = true;
    this.cleared = false;
  }

  undoClearNote() {
    /* Restore the recently removed note text. */
    this.noteText = this.clearedNoteText;
    this.datastore.saved = false;
    this.cleared = false;
  }

  clearNote() {
    /* Clear the note. */
    // record the current note text
    this.clearedNoteText = this.noteText;
    this.reset();
    this.cleared = true;
  }

  openNote(noteText: string, noteId: string) {
    this.noteText = noteText;
    this.noteId = noteId;
    this.focus();
    this.datastore.saved = true;
  }

  saveNote() {
    this.datastore.save('', this.noteText);
    // TODO: I'm only resetting because I don't yet know how to update the noteID from the datastore... once I get that working, I need to fix this
    this.reset();
  }

  updateNote() {
    this.datastore.save(this.noteId, this.noteText);
    this.focus();
    this.datastore.saved = true;
    this.cleared = false;
  }

  deleteNote(noteText: string, noteId: string) {
    this.reset();
    this.datastore.delete(noteId);
    this.datastore.saved = false;
    // set the note text - I am intentionally not clearing this value so the user can re-save the note if the deletion was a mistake
    this.noteText = noteText;
  }

}
