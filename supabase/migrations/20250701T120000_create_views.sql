-- Drop views if they exist
drop view if exists random_note;
drop view if exists tag_summaries;
drop view if exists untagged_notes;

-- Create random_note view
create view random_note as
select
  id,
  title,
  content,
  image_url,
  image_caption,
  is_important,
  created_at,
  updated_at
from notes
order by random()
limit 1;

-- Create tag_summaries view
create view tag_summaries as
select
  notes_tags.tag_id,
  notes.title,
  notes.is_important,
  count(notes_tags.note_id) as notes_count
from notes_tags
join notes on notes_tags.tag_id = notes.id
group by notes_tags.tag_id, notes.title, notes.is_important;

-- Create untagged_notes view
create view untagged_notes as
select
  id,
  title,
  content,
  image_url,
  image_caption,
  is_important,
  created_at,
  updated_at
from notes
where id <> '_untagged'
and id not in (
  select note_id from notes_tags
  union
  select tag_id from notes_tags
);

create or replace view notes_with_tags as
select
  n.id as note_id,
  n.title as note_title,
  n.content as note_content,
  n.image_url,
  n.image_caption,
  n.created_at,
  n.updated_at,
  t.id as tag_id,
  t.title as tag_title,
  t.is_important as tag_is_important
from notes n
left join notes_tags nt on nt.note_id = n.id
left join notes t on t.id = nt.tag_id;